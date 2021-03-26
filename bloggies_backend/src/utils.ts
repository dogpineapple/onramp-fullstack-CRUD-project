import { ACCEPTED, INACTIVE } from "./membershipStatuses";

export const ableToStartSub = (membershipStatus: string):boolean => {
  return membershipStatus === INACTIVE || membershipStatus === ACCEPTED;
};