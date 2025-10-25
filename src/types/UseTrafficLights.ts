const TRAFFIC_LIGHT = { red: 'green', green: 'yellow', yellow: 'red' };
type TRAFFIC_LIGHT_TYPE = keyof typeof TRAFFIC_LIGHT;
export type UseTrafficLight = {
  light: TRAFFIC_LIGHT_TYPE;
};
