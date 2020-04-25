interface AboutContent {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  social: Array<AboutSocial>;
}

interface AboutSocial {
  socialUrl: string;
  faIcon: string;
}
