import { Component, OnInit, Input } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-embeded-googlemap',
  templateUrl: './embeded-googlemap.component.html',
  styleUrls: ['./embeded-googlemap.component.css']
})
export class EmbededGooglemapComponent implements OnInit {
  @Input() width: string;
  @Input() height: string;
  @Input() address: string;
  @Input() zoom: '13';
  currentUrl: SafeUrl;

  public src: string;
  constructor(public domSanitizer: DomSanitizer) {
    this.currentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit(): void {
    this.updateSrc(this.address, this.zoom);
  }

  updateSrc(address: string, zoom: string) {
    const url = `https://maps.google.com/maps?q=${address}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
    this.currentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}