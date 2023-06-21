export class User {
    id: number;
    matricule: string;
    firstName: string;
    lastName: string;
    address: string;
    position: string;
    birthDate: Date;
    startDate: Date;
    leaveBalance: number;
    role: string;
    phoneNumber: string;
    phoneSecondary: string;
    email: string;
    password: string;
    constructor(user: User) {
      {
        this.id = user.id || 0;
        this.matricule = user.matricule || '';
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.address = user.address || '';
        this.position = user.position || '';
        this.birthDate = user.birthDate || '';
        this.startDate = user.startDate || '';
        this.leaveBalance = user.leaveBalance || 0;
        this.role = user.role || '';
        this.phoneNumber = user.phoneNumber || '';
        this.phoneSecondary = user.phoneSecondary || '';
        this.email = user.email || '';
        this.password = user.password || '';
      }
    }
  }


  