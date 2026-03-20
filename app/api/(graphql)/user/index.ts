import {QueryLibrary} from "naystack/graphql";
import getCurrentUser from "@/app/api/(graphql)/user/resolvers/get-current-user";
import updateCurrentUser from "@/app/api/(graphql)/user/resolvers/update-current-user";

export default QueryLibrary({
  getCurrentUser,
  updateCurrentUser,
})
