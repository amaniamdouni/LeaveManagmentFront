export enum ClaimPriority {
  HIGH = 'HIGH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM'
}
export enum ClaimStatus{
  IN_PROGRESS ='IN_PROGRESS',
  ON_HOLD='ON_HOLD',
  ACCEPTED='ACCEPTED'
}
export class AllClaims {
  id: number;
  claimStatus: ClaimStatus;
  claimPriority: ClaimPriority;
  dateClaim: Date;
  description: string;
}
