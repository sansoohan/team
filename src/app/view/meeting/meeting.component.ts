'use strict';

import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { RouterHelper } from 'src/app/helper/router.helper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})

export class MeetingComponent implements OnInit, OnDestroy {
  @ViewChild ('localVideo') public localVideo: ElementRef;
  @ViewChild ('remoteContainer') public remoteContainer: ElementRef;
  @ViewChild ('canvasVideo') public canvasVideo: ElementRef;
  @ViewChild ('localCanvas') public localCanvas: ElementRef;

  localStream: any;
  canvasStream: any;
  peerConnections: Array<RTCPeerConnection>;
  remoteStreams: Array<MediaStream>;
  remoteVideos: Array<any>;
  paramSub: Subscription;
  params: any;
  room: string;
  config: any;
  databaseRoot: string;
  roomBroadcastRef: AngularFireList<any>;
  clientRef: AngularFireList<any>;
  clientId: string;
  dataDebugFlag: boolean;
  MAX_CONNECTION_COUNT: number;
  peerConnection: RTCPeerConnection;
  rtcConfiguration: RTCConfiguration;

  deviceRotation: number;
  isMobileDevice: boolean;
  localCanvasZoom: number;
  isLocalVideoOn: boolean;
  isLocalAudioOn: boolean;
  isRemoteVideoOns: Array<boolean>;
  isRemoteAudioOns: Array<boolean>;
  isScreenSharing: boolean;
  shareStream: MediaStream;
  localCanvasInterval: any;
  mediaDevices: any;
  roomLayout: any;

  constructor(
    private database: AngularFireDatabase,
    private routerHelper: RouterHelper,
    private route: ActivatedRoute,
  ) {
    this.paramSub = this.route.params.subscribe((params) => {
      this.params = params;
      this.databaseRoot = 'talk/meeting_room/';
      // this.remoteVideo = document.getElementById('remote_video');
      this.localStream = null;
      this.peerConnection = null;
      // this.textForSendSdp = document.getElementById('text_for_send_sdp');
      // this.textToReceiveSdp = document.getElementById('text_for_receive_sdp');

      // ---- for multi party -----
      this.peerConnections = [];
      this.remoteStreams = [];
      this.remoteVideos = [];
      this.isRemoteAudioOns = [];
      this.isRemoteVideoOns = [];
      this.MAX_CONNECTION_COUNT = 3;

      // --- multi video ---
      // this._assert('remoteContainer', this.remoteContainer.nativeElement);
      this.dataDebugFlag = false;
      this.room = params.roomId;
      this.getRoomName();
      if (!this.room) {
        const newParams = Object.assign({}, params);
        newParams.roomId = this.getRoomName();
        this.routerHelper.goToMeeting(newParams);
        return;
      }
      // Initialize Firebase

      this.rtcConfiguration = {
        iceServers: [
          {
            urls: [
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
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
      };

      this.isScreenSharing = false;
      this.isLocalVideoOn = true;
      this.isLocalAudioOn = true;

      // tslint:disable-next-line: deprecation
      if (window.orientation === undefined) {
        this.deviceRotation = 90;
        this.isMobileDevice = false;
      } else {
        // tslint:disable-next-line: deprecation
        this.deviceRotation = Number(window.orientation);
        this.isMobileDevice = true;
      }
      window.addEventListener('orientationchange', () => {
        // tslint:disable-next-line: deprecation
        this.deviceRotation = Number(window.orientation);
      });
      this.localCanvasZoom = 1;

      this.joinRoom(this.room).then(async () => {
        await this.updateVideoState();
        await new Promise((resolve) => {
          setTimeout(async () => {
            resolve();
          }, 2000);
        });
        this.connect();
      });
    });
  }

  getMediaConstrains(memberCount: number): any {
    if (memberCount > 15) {
      return {
        video: false,
        audio: true,
      };
    }

    const frameRate =
    memberCount <= 1 ? { ideal: 30, max: 30 } :
    memberCount <= 2 ? { ideal: 30, max: 30 } :
    memberCount <= 3 ? { ideal: 20, max: 20 } :
    memberCount <= 4 ? { ideal: 15, max: 15 } :
    memberCount <= 6 ? { ideal: 12, max: 12 } :
    memberCount <= 9 ? { ideal: 9, max: 9 } :
    memberCount <= 12 ? { ideal: 7, max: 7 } :
      { ideal: 5, max: 5 };
    const {width, height} =
    memberCount <= 4 ? {width: { ideal: 640, max: 640 }, height: { ideal: 480, max: 480 }} :
    memberCount <= 6 ? {width: { ideal: 480, max: 480 }, height: { ideal: 360, max: 360 }} :
    memberCount <= 9 ? {width: { ideal: 320, max: 320 }, height: { ideal: 240, max: 240 }} :
    memberCount <= 12 ? {width: { ideal: 240, max: 240 }, height: { ideal: 180, max: 180 }} :
      {width: { ideal: 160, max: 160 }, height: { ideal: 120, max: 120 }};

    return {
      video: {
        width,
        height,
        frameRate,
      },
      audio: true,
    };
  }

  setMediaStatus(stream: MediaStream, mediaType: string, status: boolean): void {
    stream[`get${mediaType}Tracks`]().forEach((track) => track.enabled = status);
  }

  clickLocalVideoToggle(): void {
    this.isLocalVideoOn = !this.isLocalVideoOn;
    if (this.isScreenSharing) {
      if (this.shareStream) {
        this.setMediaStatus(this.shareStream, 'Video', this.isLocalVideoOn);
      }
    } else {
      if (this.canvasStream) {
        this.setMediaStatus(this.canvasStream, 'Video', this.isLocalVideoOn);
      }
    }
  }

  clickLocalAudioToggle(): void {
    this.isLocalAudioOn = !this.isLocalAudioOn;
    if (this.canvasStream) {
      this.setMediaStatus(this.canvasStream, 'Audio', this.isLocalAudioOn);
    }
  }

  clickRemoteVideoToggle(id: string): void {
    this.isRemoteVideoOns[id] = !this.isRemoteVideoOns[id];
    if (this.remoteStreams[id]) {
      this.setMediaStatus(this.remoteStreams[id], 'Video', this.isRemoteVideoOns[id]);
    }
  }

  clickRemoteAudioToggle(id: string): void {
    this.isRemoteAudioOns[id] = !this.isRemoteAudioOns[id];
    if (this.remoteStreams[id]) {
      this.setMediaStatus(this.remoteStreams[id], 'Audio', this.isRemoteAudioOns[id]);
    }
  }

  getVideoLength(): number {
    return Object.keys(this.remoteVideos).length + 1;
  }

  toggleFullScreen(videoGroup: ElementRef): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const el: any = videoGroup;
      if (el.requestFullscreen) { el.requestFullscreen(); }
      else if (el.msRequestFullscreen) { el.msRequestFullscreen(); }
      else if (el.mozRequestFullScreen) { el.mozRequestFullScreen(); }
      else if (el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); }
    }
  }

  async handleClickStartScreenSharing(): Promise<void> {
    try {
      this.shareStream = await navigator.mediaDevices[`getDisplayMedia`]({video: true});
      this.setMediaStatus(this.shareStream, 'Video', this.isLocalVideoOn);
      this.canvasVideo.nativeElement.srcObject = this.shareStream;
      const videoSender = this.peerConnection.getSenders().find(sender => {
        return sender.track.kind === 'video';
      });
      const [screenVideoTrack] = this.shareStream.getVideoTracks();
      videoSender.replaceTrack(screenVideoTrack);
      screenVideoTrack.addEventListener('ended', () => {
        this.handleClickStopScreenSharing();
      }, {once: true});
      this.isScreenSharing = true;
    } catch (error) {
      console.error(error);
    }
  }

  handleClickStopScreenSharing() {
    this.canvasVideo.nativeElement.srcObject = this.canvasStream;
    const videoSender = this.peerConnection.getSenders().find(sender => {
      return sender.track.kind === 'video';
    });
    const [screenVideoTrack] = this.canvasStream.getVideoTracks();
    videoSender.replaceTrack(screenVideoTrack);
    this.isScreenSharing = false;
  }

  drawContext(videoTag: ElementRef, canvasTag: ElementRef) {
    if (!videoTag?.nativeElement) {
      return;
    }
    const isHorizontal = this.deviceRotation === 90 || this.deviceRotation === -90;
    const width = videoTag.nativeElement.videoWidth;
    const height = videoTag.nativeElement.videoHeight;
    if (width / 4 > height / 3){
      const overWidth = (width / 4 - height / 3) * 4;
      const canvasWidth = canvasTag.nativeElement.width = width - overWidth;
      const canvasHeight = canvasTag.nativeElement.height = height;
      canvasTag.nativeElement.getContext('2d').drawImage(
        videoTag.nativeElement,
        overWidth / 2, 0, canvasWidth, canvasHeight,
        0, 0, canvasWidth, canvasHeight,
      );
    }
    else if (width / 4 < height / 3) {
      const overHeight = (width / 4 - height / 3) * (-3);
      const canvasWidth = canvasTag.nativeElement.width = width;
      const canvasHeight = canvasTag.nativeElement.height = height - overHeight;
      canvasTag.nativeElement.getContext('2d').drawImage(
        videoTag.nativeElement,
        0, overHeight / 2, canvasWidth, canvasHeight,
        0, 0, canvasWidth, canvasHeight,
      );
    }
    else {
      const canvasWidth = canvasTag.nativeElement.width = isHorizontal ? width : height;
      const canvasHeight = canvasTag.nativeElement.height = isHorizontal ? height : height * 3 / 4;
      canvasTag.nativeElement.getContext('2d').drawImage(videoTag.nativeElement,
        0, 0, canvasWidth, canvasHeight
      );
    }
  }


  /*---
  // ----- use socket.io ---
  let port = 3002;
  let socket = io.connect('http://localhost:' + port + '/');
    let room = this.getRoomName();
  socket.on('connect', function(evt) {
    // tslint:disable-next-line: no-console
    console.log('socket.io connected. enter room=' + room );
    socket.emit('enter', room);
  });
  socket.on('message', function(message) {
    // tslint:disable-next-line: no-console
    console.log('message:', message);
    let fromId = message.from;

    if (message.type === 'offer') {
      // -- got offer ---
      // tslint:disable-next-line: no-console
      console.log('Received offer ...');
      //let offer = message.sessionDescription;
      let offer = new RTCSessionDescription(message);
      this.setOffer(fromId, offer);
    }
    else if (message.type === 'answer') {
      // --- got answer ---
      // tslint:disable-next-line: no-console
      console.log('Received answer ...');
      //let answer = message.sessionDescription;
      let answer = new RTCSessionDescription(message);
      this.setAnswer(fromId, answer);
    }
    else if (message.type === 'candidate') {
      // --- got ICE candidate ---
      // tslint:disable-next-line: no-console
      console.log('Received ICE candidate ...');
      let candidate = new RTCIceCandidate(message.ice);
      // tslint:disable-next-line: no-console
      console.log(candidate);
      this.addIceCandidate(fromId, candidate);
    }
    else if (message.type === 'call me') {
      if (! this.isReadyToConnect()) {
        // tslint:disable-next-line: no-console
        console.log('Not ready to connect, so ignore');
        return;
      }
      else if (! this.canConnectMore()) {
        console.warn('TOO MANY connections, so ignore');
      }

      if (this.isConnectedWith(fromId)) {
        // already connnected, so skip
        // tslint:disable-next-line: no-console
        console.log('already connected, so ignore');
      }
      else {
        // connect new party
        this.makeOffer(fromId);
      }
    }
    else if (message.type === 'bye') {
      if (this.isConnectedWith(fromId)) {
        this.stopConnection(fromId);
      }
    }
  });
  socket.on('user disconnected', function(evt) {
    // tslint:disable-next-line: no-console
    console.log('====user disconnected==== evt:', evt);
    let id = evt.id;
    if (this.isConnectedWith(id)) {
      this.stopConnection(id);
    }
  });
  ---*/

  // ----- use firebase.io ----

  _assert(desc, v) {
    if (v) {
      return;
    }
    else {
      // const caller = this._assert.caller || 'Top level';
      console.error('ASSERT in %s, %s is :', desc, v);
    }
  }

  async joinRoom(room) {
    return new Promise((resolve) => {
      // tslint:disable-next-line: no-console
      console.log('join room name = ' + room);
      const key = this.database.list(this.databaseRoot + room + '/_join_')
      .push({ joined : 'unknown'}).key;
      this.clientId = 'member_' + key;
      // tslint:disable-next-line: no-console
      console.log('joined to room=' + room + ' as this.clientId=' + this.clientId);
      this.database.object(this.databaseRoot + room + '/_join_/' + key)
      .update({ joined : this.clientId});

      // remove join object
      if (!this.dataDebugFlag) {
        const jooinRef =  this.database.object(this.databaseRoot + room + '/_join_/' + key);
        jooinRef.remove();
      }

      this.roomBroadcastRef = this.database.list(this.databaseRoot + room + '/_broadcast_');
      this.roomBroadcastRef.stateChanges(['child_added']).forEach((data) => {
        // tslint:disable-next-line: no-console
        console.log('roomBroadcastRef.on(data) data.key=' + data.key + ', data.val():', data.payload.val());
        const message = data.payload.val();
        const fromId = message.from;
        if (fromId === this.clientId) {
          // ignore self message
          return;
        }

        if (message.type === 'call me') {
          if (! this.isReadyToConnect()) {
            // tslint:disable-next-line: no-console
            console.log('Not ready to connect, so ignore');
            return;
          }
          else if (! this.canConnectMore()) {
            console.warn('TOO MANY connections, so ignore');
          }

          if (this.isConnectedWith(fromId)) {
            // already connnected, so skip
            // tslint:disable-next-line: no-console
            console.log('already connected, so ignore');
          }
          else {
            // connect new party
            this.makeOffer(fromId);
          }
        }
        else if (message.type === 'bye') {
          if (this.isConnectedWith(fromId)) {
            this.stopConnection(fromId);
          }
        }
      });

      this.clientRef = this.database.list(this.databaseRoot + room + '/_direct_/' + this.clientId);
      this.clientRef.stateChanges(['child_added']).forEach((data) => {
        // tslint:disable-next-line: no-console
        console.log('clientRef.on(data)  data.key=' + data.key + ', data.val():', data.payload.val());
        const message = data.payload.val();
        const fromId = message.from;

        if (message.type === 'offer') {
          // -- got offer ---
          // let offer = message.sessionDescription;
          const offer: any = new RTCSessionDescription(message);
          // tslint:disable-next-line: no-console
          console.log('Received offer ... fromId=' + fromId, offer);
          this.setOffer(fromId, offer);
        }
        else if (message.type === 'answer') {
          // --- got answer ---
          // tslint:disable-next-line: no-console
          console.log('Received answer ... fromId=' + fromId);
          // const answer = message.sessionDescription;
          const answer = new RTCSessionDescription(message);
          this.setAnswer(fromId, answer);
        }
        else if (message.type === 'candidate') {
          // --- got ICE candidate ---
          // tslint:disable-next-line: no-console
          console.log('Received ICE candidate ... fromId=' + fromId);
          // const candidate = new RTCIceCandidate(message.ice);
          const candidate: any = new RTCIceCandidate(JSON.parse(message.ice)); // <---- JSON
          // tslint:disable-next-line: no-console
          console.log(message.ice);
          this.addIceCandidate(fromId, candidate);
        }

        if (!this.dataDebugFlag) {
          // remove direct message
          const messageRef =  this.database.object(this.databaseRoot + room + '/_direct_/' + this.clientId + '/' + data.key);
          messageRef.remove();
        }
      });
      resolve();
    });
  }

  // ----- use firebase.io ---- //


  // --- broadcast message to all members in room
  emitRoom(msg) {
    // socket.emit('message', msg);
    msg.from = this.clientId;
    this.roomBroadcastRef.push(msg);
  }

  emitTo(id, msg) {
    // msg.sendto = id;
    // socket.emit('message', msg);

    // tslint:disable-next-line: no-console
    console.log('===== sending from=' + this.clientId + ' ,  to=' + id);
    msg.from = this.clientId;
    this.database.list(this.databaseRoot + this.room + '/_direct_/' + id).push(msg);
  }

  clearMessage() {
    this.clientRef.remove();
  }

  // -- room名を取得 --
  getRoomName() { // たとえば、 URLに  ?roomname  とする
    return this.getUniqueStr();
  }

  // http://qiita.com/coa00@github/items/679b0b5c7c468698d53f
  // 疑似ユニークIDを生成
  getUniqueStr(myStrong = null) {
    let strong = 1000;
    if (myStrong) { strong = myStrong; }
    return new Date().getTime().toString(16)  + Math.floor(strong * Math.random()).toString(16);
  }


  // ---- for multi party -----
  isReadyToConnect() {
    if (this.localStream) {
      return true;
    }
    else {
      return false;
    }
  }

  // --- RTCPeerConnections ---
  getConnectionCount() {
    return this.peerConnections.length;
  }

  canConnectMore() {
    return (this.getConnectionCount() < this.MAX_CONNECTION_COUNT);
  }

  isConnectedWith(id) {
    if (this.peerConnections[id])  {
      return true;
    }
    else {
      return false;
    }
  }

  addConnection(id, peer) {
    this._assert('this.addConnection() peer', peer);
    this._assert('this.addConnection() peer must NOT EXIST', (! this.peerConnections[id]));
    this.peerConnections[id] = peer;
  }

  getConnection(id) {
    const peer = this.peerConnections[id];
    this._assert('this.getConnection() peer must exist', peer);
    return peer;
  }

  deleteConnection(id) {
    this._assert('this.deleteConnection() peer must exist', this.peerConnections[id]);
    delete this.peerConnections[id];
  }

  stopConnection(id) {
    this.detachVideo(id);

    if (this.isConnectedWith(id)) {
      const peer = this.getConnection(id);
      peer.close();
      this.deleteConnection(id);
    }
  }

  stopAllConnection() {
    for (const id in this.peerConnections) {
      if (id) {
        this.stopConnection(id);
      }
    }
  }

  // --- remote streams ---
  addRemoteStream(id, stream) {
    const ID_SPLITER = ':';
    this._assert('addRemoteStream() id=' + id + 'stream:', stream);
    const concatId = id + ID_SPLITER + stream.id;
    // tslint:disable-next-line: no-console
    console.log('add remote steram, concatId=' + concatId);
    this._assert('addRemoteStream() stream must NOT EXIST', (! this.remoteStreams[concatId]));
    this.remoteStreams[concatId] = stream;
  }

  getRemoteStream(id) {
    const stream = this.remoteStreams[id];
    this._assert('getRemoteStream() stream must exist', stream);
    return stream;
  }

  deleteRemoteStream(id) {
    const ID_SPLITER = ':';
    for (const key in this.remoteStreams) {
      if (key) {
        // tslint:disable-next-line: no-console
        console.log('concatId=' + id);
        const ids = key.split(ID_SPLITER);
        const peerId = ids[0];
        const streamId = ids[1];
        if (peerId === id) {
          delete this.remoteStreams[id];
        }
      }
    }
  }

  isRemoteStreamExist(id, stream) {
    const ID_SPLITER = ':';
    const concatId = id + ID_SPLITER + stream.id;
    for (const key in this.remoteStreams) {
      if (key === concatId) {
        // tslint:disable-next-line: no-console
        console.log('isRemoteStreamExist key=' + key);
        return true;
      }
    }

    return false;
  }

  // --- video elements ---
  attachVideo(id, stream) {
    const video = this.addRemoteVideoElement(id);
    this.playVideo(video, stream);
    video.volume = 1.0;
  }

  detachVideo(id) {
    const video = this.getRemoteVideoElement(id);
    if (!video) {
      return;
    }
    this.pauseVideo(video);
    this.deleteRemoteVideoElement(id);
  }

  isRemoteVideoAttached(id) {
    if (this.remoteVideos[id]) {
      return true;
    }
    else {
      return false;
    }
  }

  addRemoteVideoElement(id) {
    this._assert('this.addRemoteVideoElement() video must NOT EXIST', (! this.remoteVideos[id]));
    const video = this.createVideoElement('remote_video_' + id);
    this.remoteVideos[id] = video;
    this.isRemoteVideoOns[id] = false;
    this.isRemoteAudioOns[id] = false;
    const videoCouont = Object.keys(this.remoteVideos).length + 1;
    this.updateVideoState(videoCouont);
    return video;
  }

  getRemoteVideoElement(id) {
    const video = this.remoteVideos[id];
    this._assert('this.getRemoteVideoElement() video must exist', video);
    return video;
  }

  deleteRemoteVideoElement(id) {
    this._assert('this.deleteRemoteVideoElement() stream must exist', this.remoteVideos[id]);
    this.removeVideoElement('remote_video_' + id);
    delete this.remoteVideos[id];
    delete this.isRemoteVideoOns[id];
    delete this.isRemoteAudioOns[id];
    const videoCouont = Object.keys(this.remoteVideos).length + 1;
    this.updateVideoState(videoCouont);
  }

  createVideoElement(elementId) {
    const video: any = document.createElement('video');
    video.id = elementId;
    this.remoteContainer.nativeElement.appendChild(video);
    return video;
  }

  removeVideoElement(elementId) {
    const video = document.getElementById(elementId);
    this._assert('this.removeVideoElement() video must exist', video);

    this.remoteContainer.nativeElement.removeChild(video);
    return video;
  }

  // ---------------------- media handling -----------------------
  async updateVideoResolution(videoCount: number) {
    this.localStream = await this.mediaDevices.getUserMedia(this.getMediaConstrains(videoCount));
    this.playVideo(this.localVideo.nativeElement, this.localStream);
  }

  updateVideoFrameRate(videoCount: number): void {
    const {
      video: {
        frameRate: {
          ideal: videoFps
        }
      }
    } = this.getMediaConstrains(videoCount);
    clearInterval(this.localCanvasInterval);
    this.localCanvasInterval = setInterval(this.drawContext.bind(
      this, this.localVideo, this.localCanvas
    ), 1000 / videoFps);
  }

  // start local video
  async updateVideoState(videoCount = 1) {
    const navi: any = navigator;
    this.mediaDevices = navigator.mediaDevices ||
    ((navi.mozGetUserMedia || navi.webkitGetUserMedia) ? {
      getUserMedia(c) {
        return new Promise((y, n) => {
          (navi.mozGetUserMedia ||
            navi.webkitGetUserMedia).call(navigator, c, y, n);
        });
      }
    } : null);

    if (!this.mediaDevices) {
      // tslint:disable-next-line: no-console
      console.log('getUserMedia() not supported.');
      return;
    }

    await this.updateVideoResolution(videoCount);
    if (/Firefox/g.test(navigator.userAgent)) {
      await new Promise((resolve) => {
        setTimeout(async () => {
          resolve();
        }, 3000);
      });
    }

    this.canvasStream = this.localCanvas.nativeElement.captureStream();
    const [localVideoAudio] = this.localStream.getAudioTracks();
    this.canvasStream.addTrack(localVideoAudio);

    this.setMediaStatus(
      this.isMobileDevice ? this.canvasStream : this.localStream,
      'Video', this.isLocalVideoOn
    );
    this.setMediaStatus(
      this.isMobileDevice ? this.canvasStream : this.localStream,
      'Audio', this.isLocalAudioOn
    );

    this.playVideo(this.canvasVideo.nativeElement, this.canvasStream);
    this.updateVideoFrameRate(videoCount);
  }

  // stop local video
  stopVideo() {
    this.pauseVideo(this.localVideo.nativeElement);
    this.stopLocalStream(this.localStream);
    this.localStream = null;
  }

  stopLocalStream(stream) {
    const tracks = stream.getTracks();
    if (! tracks) {
      console.warn('NO tracks');
      return;
    }

    for (const track of tracks) {
      track.stop();
    }
  }

  getDeviceStream(option) {
    if ('getUserMedia' in navigator.mediaDevices) {
      // tslint:disable-next-line: no-console
      console.log('navigator.mediaDevices.getUserMadia');
      return navigator.mediaDevices.getUserMedia(option);
    }
    else {
      // tslint:disable-next-line: no-console
      console.log('wrap navigator.getUserMadia with Promise');
      return new Promise((resolve, reject) => {
        navigator.getUserMedia(option,
          resolve,
          reject
        );
      });
    }
  }

  playVideo(element, stream) {
    if ('srcObject' in element) {
      element.srcObject = stream;
    }
    else {
      element.src = window.URL.createObjectURL(stream);
    }
    element.play();
    element.volume = 0;
  }

  pauseVideo(element) {
    element.pause();
    if ('srcObject' in element) {
      element.srcObject = null;
    }
    else {
      if (element.src && (element.src !== '') ) {
        window.URL.revokeObjectURL(element.src);
      }
      element.src = '';
    }
  }

  /*--
  // ----- hand signaling ----
  function onSdpText() {
    let text = textToReceiveSdp.value;
    if (peerConnection) {
      // tslint:disable-next-line: no-console
      console.log('Received answer text...');
      let answer = new RTCSessionDescription({
        type : 'answer',
        sdp : text,
      });
      this.setAnswer(answer);
    }
    else {
      // tslint:disable-next-line: no-console
      console.log('Received offer text...');
      let offer = new RTCSessionDescription({
        type : 'offer',
        sdp : text,
      });
      this.setOffer(offer);
    }
    textToReceiveSdp.value ='';
  }
  --*/

  sendSdp(id, sessionDescription) {
    // tslint:disable-next-line: no-console
    console.log('---sending sdp ---');

    /*---
    textForSendSdp.value = sessionDescription.sdp;
    textForSendSdp.focus();
    textForSendSdp.select();
    ----*/

    const message = { type: sessionDescription.type, sdp: sessionDescription.sdp };
    // tslint:disable-next-line: no-console
    console.log('sending SDP=' + message);
    // ws.send(message);
    // socket.emit('message', message);
    this.emitTo(id, message);
  }

  sendIceCandidate(id, candidate) {
    // tslint:disable-next-line: no-console
    console.log('---sending ICE candidate ---');
    const obj = { type: 'candidate', ice: JSON.stringify(candidate) }; // <--- JSON
    const message = JSON.stringify(obj);
    // tslint:disable-next-line: no-console
    console.log('sending candidate=' + message);
    // ws.send(message);
    // socket.emit('message', obj);
    this.emitTo(id, obj);
  }

  // ---------------------- connection handling -----------------------
  prepareNewConnection(id) {
    const peer: any = new RTCPeerConnection(this.rtcConfiguration);

    // --- on get remote stream ---
    if ('ontrack' in peer) {
      peer.ontrack = (event) => {
        const stream = event.streams[0];
        // tslint:disable-next-line: no-console
        console.log('-- peer.ontrack() stream.id=' + stream.id);
        if (this.isRemoteVideoAttached(id)) {
          // tslint:disable-next-line: no-console
          console.log('stream already attached, so ignore');
        }
        else {
          // this.playVideo(remoteVideo, stream);
          this.attachVideo(id, stream);
        }
      };
    }
    else {
      peer.onaddstream = (event) => {
        const stream = event.stream;
        // tslint:disable-next-line: no-console
        console.log('-- peer.onaddstream() stream.id=' + stream.id);
        // this.playVideo(remoteVideo, stream);
        this.attachVideo(id, stream);
      };
    }

    // --- on get local ICE candidate
    peer.onicecandidate = (evt) => {
      if (evt.candidate) {
        // tslint:disable-next-line: no-console
        console.log(evt.candidate);

        // Trickle ICE の場合は、ICE candidateを相手に送る
        this.sendIceCandidate(id, evt.candidate);

        // Vanilla ICE の場合には、何もしない
      } else {
        // tslint:disable-next-line: no-console
        console.log('empty ice event');

        // Trickle ICE の場合は、何もしない

        // Vanilla ICE の場合には、ICE candidateを含んだSDPを相手に送る
        // sendSdp(id, peer.localDescription);
      }
    };

    // --- when need to exchange SDP ---
    peer.onnegotiationneeded = (evt) => {
      // tslint:disable-next-line: no-console
      console.log('-- onnegotiationneeded() ---');
    };

    // --- other events ----
    peer.onicecandidateerror = (evt) => {
      console.error('ICE candidate ERROR:', evt);
    };

    peer.onsignalingstatechange = () => {
      // tslint:disable-next-line: no-console
      console.log('== signaling status=' + peer.signalingState);
    };

    peer.oniceconnectionstatechange = () => {
      // tslint:disable-next-line: no-console
      console.log('== ice connection status=' + peer.iceConnectionState);
      if (peer.iceConnectionState === 'disconnected') {
        // tslint:disable-next-line: no-console
        console.log('-- disconnected --');
        // hangUp();
        this.stopConnection(id);
      }
    };

    peer.onicegatheringstatechange = () => {
      // tslint:disable-next-line: no-console
      console.log('==***== ice gathering state=' + peer.iceGatheringState);
    };

    peer.onconnectionstatechange = () => {
      // tslint:disable-next-line: no-console
      console.log('==***== connection state=' + peer.connectionState);
    };

    peer.onremovestream = (event) => {
      // tslint:disable-next-line: no-console
      console.log('-- peer.onremovestream()');
      // this.pauseVideo(remoteVideo);
      this.deleteRemoteStream(id);
      this.detachVideo(id);
    };

    // -- add local stream --
    if (this.canvasStream) {
      // tslint:disable-next-line: no-console
      console.log('Adding local stream...');
      peer.addStream(this.canvasStream);
    }
    else {
      console.warn('no local stream, but continue.');
    }

    return peer;
  }

  makeOffer(id) {
    this._assert('this.makeOffer must not connected yet', (! this.isConnectedWith(id)) );
    this.peerConnection = this.prepareNewConnection(id);
    this.addConnection(id, this.peerConnection);

    this.peerConnection.createOffer()
    .then((sessionDescription) => {
      // tslint:disable-next-line: no-console
      console.log('createOffer() succsess in promise');
      return this.peerConnection.setLocalDescription(sessionDescription);
    }).then(() => {
      // tslint:disable-next-line: no-console
      console.log('setLocalDescription() succsess in promise');

      // -- Trickle ICE の場合は、初期SDPを相手に送る --
      this.sendSdp(id, this.peerConnection.localDescription);

      // -- Vanilla ICE の場合には、まだSDPは送らない --
    }).catch((err) => {
      console.error(err);
    });
  }

  setOffer(id, sessionDescription) {
    /*
    if (peerConnection) {
      console.error('peerConnection alreay exist!');
    }
    */
    this._assert('this.setOffer must not connected yet', (! this.isConnectedWith(id)) );
    const peerConnection = this.prepareNewConnection(id);
    this.addConnection(id, peerConnection);

    peerConnection.setRemoteDescription(sessionDescription)
    .then(() => {
      // tslint:disable-next-line: no-console
      console.log('setRemoteDescription(offer) succsess in promise');
      this.makeAnswer(id);
    }).catch((err) => {
      console.error('setRemoteDescription(offer) ERROR: ', err);
    });
  }

  makeAnswer(id) {
    // tslint:disable-next-line: no-console
    console.log('sending Answer. Creating remote session description...' );
    const peerConnection = this.getConnection(id);
    if (! peerConnection) {
      console.error('peerConnection NOT exist!');
      return;
    }

    peerConnection.createAnswer()
    .then((sessionDescription) => {
      // tslint:disable-next-line: no-console
      console.log('createAnswer() succsess in promise');
      return peerConnection.setLocalDescription(sessionDescription);
    }).then(() => {
      // tslint:disable-next-line: no-console
      console.log('setLocalDescription() succsess in promise');

      // -- Trickle ICE の場合は、初期SDPを相手に送る --
      this.sendSdp(id, peerConnection.localDescription);

      // -- Vanilla ICE の場合には、まだSDPは送らない --
    }).catch((err) => {
      console.error(err);
    });
  }

  setAnswer(id, sessionDescription) {
    const peerConnection = this.getConnection(id);
    if (! peerConnection) {
      console.error('peerConnection NOT exist!');
      return;
    }

    peerConnection.setRemoteDescription(sessionDescription)
    .then(() => {
      // tslint:disable-next-line: no-console
      console.log('setRemoteDescription(answer) succsess in promise');
    }).catch((err) => {
      console.error('setRemoteDescription(answer) ERROR: ', err);
    });
  }

  // --- tricke ICE ---
  addIceCandidate(id, candidate) {
    const peerConnection = this.getConnection(id);
    if (peerConnection) {
      peerConnection.addIceCandidate(candidate);
    }
    else {
      console.error('PeerConnection not exist!');
      return;
    }
  }

  // start PeerConnection
  connect() {
    /*
    debugger; // SHOULD NOT COME HERE

    if (! peerConnection) {
      // tslint:disable-next-line: no-console
      console.log('make Offer');
      this.makeOffer();
    }
    else {
      console.warn('peer already exist.');
    }
    */

    if (! this.isReadyToConnect()) {
      console.warn('NOT READY to connect');
    }
    else if (! this.canConnectMore()) {
      // tslint:disable-next-line: no-console
      console.log('TOO MANY connections');
    }
    else {
      this.callMe();
    }
  }

  // close PeerConnection
  hangUp() {
    /*
    if (peerConnection) {
      // tslint:disable-next-line: no-console
      console.log('Hang up.');
      peerConnection.close();
      peerConnection = null;
      this.pauseVideo(remoteVideo);
    }
    else {
      console.warn('peer NOT exist.');
    }
    */

    this.emitRoom({ type: 'bye' });
    this.clearMessage(); // clear firebase
    this.stopAllConnection();
  }

  // ---- multi party --
  callMe() {
    this.emitRoom({type: 'call me'});
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    clearInterval(this.localCanvasInterval);
    this.hangUp();
    this.stopVideo();
  }
}
