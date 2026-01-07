export const CATEGORY_TYPE = {
  TODO: 0,
  FOOD: 1
};

export const CATEGORY_NAME = {
  [CATEGORY_TYPE.TODO]: '共同待辦',
  [CATEGORY_TYPE.FOOD]: '美食清單'
};

export const TABS_CONFIG = [
  { id: CATEGORY_TYPE.TODO, label: CATEGORY_NAME[CATEGORY_TYPE.TODO], iconName: 'ListBulletIcon' },
  { id: CATEGORY_TYPE.FOOD, label: CATEGORY_NAME[CATEGORY_TYPE.FOOD], iconName: 'CakeIcon' }
];