import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { ToastHelper } from 'src/app/helper/toast.helper';
import { Subscription, Observable } from 'rxjs';
import { TalkContent } from '../talk.content';
import { TalkService } from 'src/app/services/talk.service';
import { ActivatedRoute } from '@angular/router';
import { RouterHelper } from 'src/app/helper/router.helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-talk-room',
  templateUrl: './room.component.html',
  styleUrls: ['../talk.component.css', './room.component.css'],
})
export class RoomComponent implements OnInit {
  // WebRTC Connection
  localStream: MediaStream;
  peerConnection: RTCPeerConnection;
  remoteStream: MediaStream;
  roomId: string;
  createdRoomUrl: string;
  callerCandidatesString: string;
  calleeCandidatesString: string;
  configuration: any;
  isInRoom: boolean;
  params: any;
  paramSub: Subscription;
  roomJoinSubscribe: Subscription;
  talkSub: Subscription;

  @ViewChild ('localVideo') public localVideo: ElementRef;
  @ViewChild ('remoteVideo') public remoteVideo: ElementRef;

  isPage: boolean;
  isLoading: boolean;
  isCopiedToClipboard: boolean;
  talkContentsObserver: Observable<TalkContent[]>;
  talkContents: TalkContent[];

  constructor(
    private firestore: AngularFirestore,
    private toastHelper: ToastHelper,
    private talkService: TalkService,
    private route: ActivatedRoute,
    private routerHelper: RouterHelper,
  ) {
    this.isPage = true;
    this.isLoading = true;
    this.isCopiedToClipboard = false;
    this.callerCandidatesString = 'callerCandidates';
    this.calleeCandidatesString = 'calleeCandidates';
    this.configuration = {
      iceServers: [
        {
          urls: [
            'stun:socket.sansoohan.ga:443',
          ],
        },
        {
          urls: [
            'turn:socket.sansoohan.ga:443?transport=udp',
          ],
          username: '1608961376:sansoohan',
          credential: 'kznEtvX/flyC+5+WRpYELPa5Yz0=',
        }
      ],
      iceCandidatePoolSize: 10,
    };
    this.paramSub = this.route.params.subscribe((params) => {
      this.params = params;
      this.talkContentsObserver = this.talkService.getTalkContentsObserver({params});
      this.talkSub = this.talkContentsObserver.subscribe((talkContents) => {
        this.talkContents = talkContents;
        this.isLoading = false;
        if (params.roomId) {
          this.roomId = params.roomId;
          this.joinRoomById(this.roomId);
        }
      });
    });
  }

  async handleClickCreateRoom() {
    this.isInRoom = true;
    await this.openUserMedia();
    this.firestore
    .collection('talks').doc(this.talkContents[0].id)
    .collection('rooms').add({})
    .then(async (roomRef) => {
      // tslint:disable-next-line: no-console
      console.log('Create PeerConnection with configuration: ', this.configuration);
      this.peerConnection = new RTCPeerConnection(this.configuration);

      this.registerPeerConnectionListeners();

      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Uncomment to collect ICE candidates below
      await this.collectIceCandidates(roomRef, this.peerConnection, this.callerCandidatesString, this.calleeCandidatesString);

      // Code for creating a room below
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      // tslint:disable-next-line: no-console
      console.log('Created offer:', offer);
      await roomRef.set({
        id: roomRef.id,
        caller: JSON.parse(localStorage.currentUser || '{}').uid || null,
        createdAt: Number(new Date()),
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        }
      });
      this.roomId = roomRef.id;
      // tslint:disable-next-line: no-console
      console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
      this.createdRoomUrl = `${window.location.href}/room/${this.roomId}`;

      // Code for creating a room above
      this.peerConnection.addEventListener('track', event => {
        // tslint:disable-next-line: no-console
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          // tslint:disable-next-line: no-console
          console.log('Add a track to the remoteStream:', track);
          this.remoteStream.addTrack(track);
        });
      });

      // Listening for remote session description below
      roomRef.onSnapshot(async snapshot => {
        const data = snapshot.data();
        if (!this.peerConnection.currentRemoteDescription && data && data.answer) {
          // tslint:disable-next-line: no-console
          console.log('Got remote description: ', data.answer);
          const rtcSessionDescription = new RTCSessionDescription(data.answer);
          await this.peerConnection.setRemoteDescription(rtcSessionDescription);
        }
      });
      // Listening for remote session description above
    });
  }

  handleClickJoinRoom() {
    this.toastHelper.showPrompt('Join Talk', 'Please Enter TalkRoom Url')
    .then(async (roomUrl) => {
      if (!roomUrl.value) {
        return;
      }
      const params = Object.assign({roomUrl: roomUrl.value}, this.params);
      // tslint:disable-next-line: no-console
      console.log('Join Room URL: ', roomUrl.value);
      this.routerHelper.goToUrl(roomUrl.value);
    }).catch((error) => {
      this.toastHelper.showError('Join Talk', error);
    });
  }

  async joinRoomById(roomId: string) {
    this.createdRoomUrl = `${window.location.href}/room/${this.roomId}`;
    this.isInRoom = true;
    await this.openUserMedia();
    const roomRef = this.firestore
    .collection('talks').doc(this.talkContents[0].id)
    .collection('rooms').doc(`${roomId}`);
    const roomSnapshot = roomRef.get();
    // tslint:disable-next-line: no-console
    console.log('Got room:', roomRef.ref.id);

    if (roomRef.ref.id) {
      // tslint:disable-next-line: no-console
      console.log('Create PeerConnection with configuration: ', this.configuration);
      this.peerConnection = new RTCPeerConnection(this.configuration);
      this.registerPeerConnectionListeners();
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Uncomment to collect ICE candidates below
      await this.collectIceCandidates(roomRef.ref, this.peerConnection, this.calleeCandidatesString, this.callerCandidatesString);

      this.peerConnection.addEventListener('track', event => {
        // tslint:disable-next-line: no-console
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          // tslint:disable-next-line: no-console
          console.log('Add a track to the remoteStream:', track);
          this.remoteStream.addTrack(track);
        });
      });

      // Code for creating SDP answer below
      this.roomJoinSubscribe = roomSnapshot.subscribe(async (roomData) => {
        const offer = roomData.data().offer;
        // tslint:disable-next-line: no-console
        console.log('Got offer:', offer);
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peerConnection.createAnswer();
        // tslint:disable-next-line: no-console
        console.log('Created answer:', answer);
        await this.peerConnection.setLocalDescription(answer);

        const roomWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        await roomRef.update(roomWithAnswer);
        // Code for creating SDP answer above
      });
    }
  }

  // collect ICE Candidates function below
  async collectIceCandidates(
    roomRef: DocumentReference,
    peerConnection: RTCPeerConnection,
    localName: string,
    remoteName: string,
  ) {
    const candidatesCollection = roomRef.collection(localName);

    peerConnection.addEventListener('icecandidate', event => {
      if (event.candidate) {
        const json = event.candidate.toJSON();
        candidatesCollection.add(json);
      }
    });

    roomRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.addIceCandidate(candidate);
        }
      });
    });
  }
  // collect ICE Candidates function above

  async openUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia(
        {video: true, audio: true});
    this.localVideo.nativeElement.srcObject = stream;
    this.localStream = stream;
    this.remoteStream = new MediaStream();
    this.remoteVideo.nativeElement.srcObject = this.remoteStream;

    // tslint:disable-next-line: no-console
    console.log('Stream:', this.localVideo.nativeElement.srcObject);
  }

  async handleClickLeaveRoom() {
    this.isInRoom = false;
    this.isCopiedToClipboard = false;
    this.roomJoinSubscribe?.unsubscribe();
    const tracks = this.localVideo.nativeElement.srcObject.getTracks();
    tracks.forEach(track => {
      track.stop();
    });

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
    }

    if (this.peerConnection) {
      this.peerConnection.close();
    }

    this.localVideo.nativeElement.srcObject = null;
    this.remoteVideo.nativeElement.srcObject = null;
    this.createdRoomUrl = '';

    // Delete room on hangup
    if (this.roomId) {
      const roomRef = this.firestore
      .collection('talks').doc(this.talkContents[0].id)
      .collection('rooms').doc(this.roomId);
      const calleeCandidates = await roomRef.collection(this.calleeCandidatesString).get();
      calleeCandidates.forEach(async candidate => {
        candidate.forEach(async can => {
          can.ref.delete();
        });
      });
      const callerCandidates = await roomRef.collection(this.callerCandidatesString).get();
      callerCandidates.forEach(async candidate => {
        candidate.forEach(async can => {
          can.ref.delete();
        });
      });
      await roomRef.delete();
      const params = Object.assign({}, this.params);
      delete params.roomId;
      this.routerHelper.goToTalk(params);
    }
  }

  registerPeerConnectionListeners() {
    this.peerConnection.addEventListener('icegatheringstatechange', () => {
      // tslint:disable-next-line: no-console
      console.log(`ICE gathering state changed: ${this.peerConnection.iceGatheringState}`);
    });
    this.peerConnection.addEventListener('connectionstatechange', () => {
      // tslint:disable-next-line: no-console
      console.log(`Connection state change: ${this.peerConnection.connectionState}`);
    });
    this.peerConnection.addEventListener('signalingstatechange', () => {
      // tslint:disable-next-line: no-console
      console.log(`Signaling state change: ${this.peerConnection.signalingState}`);
    });
    this.peerConnection.addEventListener('iceconnectionstatechange ', () => {
      // tslint:disable-next-line: no-console
      console.log(`ICE connection state change: ${this.peerConnection.iceConnectionState}`);
    });
  }

  copyToClipboard(str: string): void{
    this.isCopiedToClipboard = true;
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  ngOnInit(): void {
  }

  OnDestroy() {
    this.handleClickLeaveRoom();
    this.talkSub?.unsubscribe();
    this.paramSub?.unsubscribe();
  }
}
