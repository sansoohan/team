export class AboutContent {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  social: Array<AboutSocial>;
  constructor(
    firstName: string = '',
    lastName: string = '',
    address: string = '',
    phoneNumber: string = '',
    email: string = '',
    social: Array<AboutSocial> = [new AboutSocial()]
  ){
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.social = social;
  }
}

export class AboutSocial {
  socialUrl: string;
  faIcon: string;
  constructor(
    socialUrl: string = '',
    faIcon: string = ''
  ){
    this.socialUrl = socialUrl;
    this.faIcon = faIcon;
  }
}
