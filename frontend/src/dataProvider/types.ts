export type BetterCRUDQuery = {
  page?: number;
  size?: number;
  sort?: string[];
  filter?: string[];
  s?: string;
};

export type SPrimitivesVal = string | number | boolean;

export type SFiledValues = SPrimitivesVal | Array<SPrimitivesVal>;

export type SFieldOperator = {
  $or?: SFieldOperator;
  $and?: never;
  $eq?: SFiledValues;
  $ne?: SFiledValues;
  $gt?: SFiledValues;
  $lt?: SFiledValues;
  $gte?: SFiledValues;
  $lte?: SFiledValues;
  $starts?: SFiledValues;
  $notstarts?: SFiledValues;
  $ends?: SFiledValues;
  $notends?: SFiledValues;
  $cont?: SFiledValues;
  $excl?: SFiledValues;
  $in?: SFiledValues;
  $notin?: SFiledValues;
  $between?: SFiledValues;
  $isnull?: SFiledValues;
  $notnull?: SFiledValues;
  $length?: SFiledValues;
};

export type SField = SPrimitivesVal | SFieldOperator;

export type SFields = {
  [key: string]: SField | Array<SFields | SConditionAND> | undefined;
  $or?: Array<SFields | SConditionAND>;
  $and?: never;
};

export type SConditionAND = {
  $and?: Array<SFields | SConditionAND>;
  $or?: never;
};

export type SCondition = SFields | SConditionAND;
