export class AdditaionProfileContent {
  title: string;
  largeGroups: Array<LargeGroup>;
  constructor(
    title: string = '',
    largeGroups: Array<LargeGroup> = [new LargeGroup()]
  ) {
    this.title = title;
    this.largeGroups = largeGroups;
  }
}

export class LargeGroup {
  largeGroupName: string;
  smallGroups: Array<SmallGroup>;
  constructor(
    largeGroupName: string = '',
    smallGroups: Array<SmallGroup> = [new SmallGroup()]
  ){
    this.largeGroupName = largeGroupName;
    this.smallGroups = smallGroups;
  }
}

export class SmallGroup {
  smallGroupName: string;
  descriptions: Array<SmallGroupDescription>;
  constructor(
    smallGroupName: string = '',
    descriptions: Array<SmallGroupDescription> = [new SmallGroupDescription()]
  ){
    this.smallGroupName = smallGroupName;
    this.descriptions = descriptions;
  }
}

export class SmallGroupDescription {
  descriptionDetail: string;
  faIcon: string;
  constructor(
    descriptionDetail: string = '',
    faIcon: string = 'fa'
  ){
    this.descriptionDetail = descriptionDetail;
    this.faIcon = faIcon;
  }
}

