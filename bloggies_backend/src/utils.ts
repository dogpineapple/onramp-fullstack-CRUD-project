import { ACCEPTED, INACTIVE } from "./membershipStatuses";

export const ableToStartSub = (membershipStatus: string):boolean => {
  return membershipStatus === INACTIVE || membershipStatus === ACCEPTED;
};


interface UserObj {
  id: number,
  display_name: string,
  membership_status: string,
  membership_start_date: Date | null,
  membership_end_date:  Date | null,
  last_submission_date: Date,
  subscription_id: string,
  customer_id: string
}
/** checks whether a user has submitted a post in the last week and returns a boolean */
export const lastSubmissionCheck = (user: UserObj) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const overdueLastSubmission: boolean = user.last_submission_date !== null && user.last_submission_date < sevenDaysAgo;
  const overdueNeverSubmitted: boolean = !user.last_submission_date && user.membership_start_date && user.membership_start_date < sevenDaysAgo;
  return overdueLastSubmission || overdueNeverSubmitted;
}