type Item<TRoute extends string> = TRoute;
type Items<TRoutes extends string[]> = Item<TRoutes[number]>[];

type FormattedItem<TRoute extends string> = {
  label: string;
  route: TRoute;
};

type FormattedItems<TRoutes extends string[]> = FormattedItem<
  TRoutes[number]
>[];

const ORIENTATION = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;
type Orientation = (typeof ORIENTATION)[keyof typeof ORIENTATION];

interface BaseInterface {
  id: string;
  logoUrl?: string;
  orientation?: Orientation;
}

interface UserProvidedInterface<TRoutes extends string[] = string[]>
  extends BaseInterface {
  items: Items<TRoutes>;
}

interface FormattedInterface<TRoutes extends string[] = string[]>
  extends BaseInterface {
  items: FormattedItems<TRoutes>;
}

export { type UserProvidedInterface, type FormattedInterface, ORIENTATION };
