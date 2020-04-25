interface AdditaionProfileContent {
  id: string;
  title: string;
  largeGroups: Array<LargeGroup>;
}

interface LargeGroup {
  largeGroupName: string;
  smallGroups: Array<SmallGroup>;
}

interface SmallGroup {
  smallGroupName: string;
  descriptions: Array<SmallGroupDescription>;
}

interface SmallGroupDescription {
  descriptionDetail: string;
  faIcon: string;
}
