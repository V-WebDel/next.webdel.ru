import Home, { generateMetadata as getHomeMetadata } from "./index";

export const revalidate = 60;

export function generateMetadata() {
  return getHomeMetadata();
}

export default Home;
