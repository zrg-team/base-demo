type VisibilityStatus = "visible" | "hidden" | "transitioning";
type Config = {
  fade?: boolean;
};

export default {
  hide: (option?: Config) => {},
  getVisibilityStatus: (): VisibilityStatus => "hidden",
};
