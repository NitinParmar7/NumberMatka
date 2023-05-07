export default class APIManager {
  private static instance: APIManager | null = null;

  private APILink: string = "";
  private GameID: string;
  private UserID: string;
  private LoginLifetimeToken: string = "4xo8wae2rwv1erma8vcv3nesm65cssacx90xv";
  private Balance: string;
  private DeviceID: string;
  private Barcode: string;

  static GetInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }

  SetGameID(NewGameId: string) {
    this.GameID = NewGameId;
  }

  SetLifeTimeToken(NewToken: string) {
    console.log("Life Time Token Set: " + NewToken);
    this.LoginLifetimeToken = NewToken;
  }

  SetBarcode(newBarcode: string) {
    this.Barcode = newBarcode;
    console.log("Barcode: " + this.Barcode);
  }

  SetUserId(NewUserId: string) {
    this.UserID = NewUserId;
  }

  GetUserID(): string {
    return this.UserID;
  }

  SetBalance(NewBalance: string) {
    this.Balance = NewBalance;
  }

  GetBalance(): string {
    return this.Balance;
  }

  SetDeviceID(NewDeviceId: string) {
    this.DeviceID = NewDeviceId;
  }

  async GameListAPI() {
    try {
      let url = this.APILink + "GameListAPI.php";
      let formData = new FormData();
      formData.append("GameToken", "3reerntbk4cvxvdner22emul9kx7czv");
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async GameValueAPI() {
    try {
      let url = this.APILink + "GameValueAPI.php";
      let formData = new FormData();
      formData.append("ValueToken", "3reerntbk4cvxvdner22emul9kx7czv");
      formData.append("GameID", this.GameID.toString());
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).formData();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async BarcodeAPI(FromTimeStamp: string, ToTimeStamp: string) {
    try {
      let url = this.APILink + "BarcodeAPI.php";
      let formData = new FormData();
      formData.append("BarocdeToken", "klxwzd3e5wreecv6vr9mnbcx0hsm2m");
      formData.append("UserID", this.UserID.toString());
      formData.append("GameId", this.GameID.toString());
      formData.append("is_array_value", "1");
      formData.append("FromTimeStamp", FromTimeStamp);
      formData.append("toTimeStamp", ToTimeStamp);
      this.PrintFormData(formData);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async CancelAPI(Barcode: string) {
    try {
      let url = this.APILink + "CancelApi.php";
      let formData = new FormData();
      formData.append("CancelToken", "3reerntbk4cvxvdner22emul9kx7czv");
      formData.append("Barcode", Barcode.toString());
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async ChangePasswordAPI(OldPassword: string, NewPassword: string) {
    try {
      let url = this.APILink + "ChangePasswordApi.php";
      let formData = new FormData();
      formData.append("PasswordToken", "3buvimtredf6bfkent7rnvicb8vcb");
      formData.append("UserID", this.UserID);
      formData.append("OldPassword", OldPassword.toString());
      formData.append("NewPassword", NewPassword.toString());
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async NextDrawTimeStampAPI() {
    try {
      let url = this.APILink + "NextDrawTimeAPI.php";
      let formData = new FormData();
      formData.append("TimeToken", "3reerntbk4cvxvdner22emul9kx7czv");
      formData.append("GameId", this.GameID);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async LoginAPI(PlayerUserID: string, Password: string) {
    try {
      let url = this.APILink + "LoginAPI.php";
      let formData = new FormData();
      formData.append("LoginToken", "4xo8wae2rwv1erma8vcv3nesm65cssacx90xv");
      formData.append("UserID", PlayerUserID);
      formData.append("Password", Password);
      formData.append("DeviceID", PlayerUserID);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async LogoutAPI(PlayerUserID: string) {
    try {
      let url = this.APILink + "LogOutApi.php";
      let formData = new FormData();
      formData.append("LogoutToken", "3buvimtredf6bfkent7rnvicb8vcb");
      formData.append("UserID", PlayerUserID);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async LoginAPILifeTime() {
    try {
      let url = this.APILink + "LoginAPILifetime.php";
      let formData = new FormData();
      formData.append("LoginToken", "MM4MwzcbD8QrqnENOPIYT0ysOnnHBU");
      formData.append("lifetime_token", this.LoginLifetimeToken);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async ResultDocAPI() {
    try {
      let url = this.APILink + "Result.php";
      let formData = new FormData();
      formData.append("ResultToken", "vmrwzd3e5wreecv8c7mnbcx0hsm3d");
      formData.append("GameId", this.GameID);
      let currentDate = new Date();
      let yesterdaysDate = new Date(currentDate);
      yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
      let yesterdaysDateStr = yesterdaysDate
        .toISOString()
        .split("T")[0]
        .replace("-", "")
        .replace("-", "");
      let currentDateStr = currentDate
        .toISOString()
        .split("T")[0]
        .replace("-", "")
        .replace("-", "");
      formData.append("FromTimeStamp", yesterdaysDateStr);
      formData.append("toTimeStamp", currentDateStr);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async ResultAPI() {
    try {
      let url = this.APILink + "ResultAPI.php";
      let formData = new FormData();
      formData.append("ResultToken", "cmxwzd3e5wreecv8c7mnbcx0hsm5u");
      formData.append("UserID", this.UserID); // User ID which we get from login
      formData.append("DeviceID", this.DeviceID); // Device ID which we get from login
      formData.append("GameId", this.GameID); // Game Id which we get from login
      formData.append("LoginToken", this.LoginLifetimeToken);
      let res = fetch(url, { method: "POST", body: formData });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async SaleAPI(Value: string) {
    try {
      let url = this.APILink + "SaleAPI.php";
      let formData = new FormData();
      formData.append("SalesToken", "3reerntbk4cvxvdner22emul9kx7czv");
      formData.append("UserID", this.UserID);
      formData.append("GameId", this.GameID);
      formData.append("Values", Value);
      console.log("Sale API: ");
      this.PrintFormData(formData);
      let res = fetch(url, {
        method: "POST",

        body: formData,
      });
      if ((await res).ok) {
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async ResultListAPI() {
    try {
      let url = this.APILink + "ResultListAPI.php";
      let formData = new FormData();
      formData.append("ResultListToken", "cmxwzd3e5wreecv8c7mnbcx0hsm5u");
      formData.append("gameID", this.GameID);
      console.log("Updating Result List: ");
      this.PrintFormData(formData);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        console.log(res);
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async UpdateTokenAPI() {
    try {
      let url = this.APILink + "UpdateTokenAPI.php";
      let formData = new FormData();
      formData.append("UpToken", "MM4MwzcbD8QrqnENOPIYT0ysOnnHBU");
      formData.append("UserId", this.UserID);
      formData.append("LifeTimeToken", this.LoginLifetimeToken);
      console.log("Updating Token: ");
      this.PrintFormData(formData);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        console.log(res);
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async GenerateBill(barcode: string = "") {
    try {
      let url = this.APILink + "GenerateBill.php";
      let formData = new FormData();
      formData.append("GameId", this.GameID);
      formData.append("ResultToken", "vmrwzd3e5wreecv1c7mnbcx0hsm3k");
      formData.append(
        "BarcodeId",
        barcode.length == 0 ? this.Barcode : barcode
      );
      console.log("generating Bill: ");
      this.PrintFormData(formData);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        console.log(res);
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  async ReportAPI(FromTimeStamp: string, ToTimeStamp: string) {
    try {
      let url = this.APILink + "ReportAPI.php";
      let formData = new FormData();
      formData.append("ReportToken", "vmrwzd3e5wreecv8c7mnbcx0hsm3d");
      formData.append("UserID", this.UserID);
      formData.append("GameId", this.GameID);
      formData.append("FromTimeStamp", FromTimeStamp);
      formData.append("toTimeStamp", ToTimeStamp);
      console.log("Report: ");
      this.PrintFormData(formData);
      let res = fetch(url, {
        method: "POST",
        body: formData,
      });
      if ((await res).ok) {
        console.log(res);
        return (await res).json();
      } else {
        return undefined;
      }
    } catch (error) {
      return error;
    }
  }

  PrintFormData(formData: FormData) {
    // Display the key/value pairs
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  }
}
