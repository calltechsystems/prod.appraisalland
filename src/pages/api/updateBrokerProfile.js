import axios from "axios";
import CryptoJS from "crypto-js";

async function handler(request, response) {
  const decryptionKey = process.env.CRYPTO_SECRET_KEY;
  const domain = process.env.BACKEND_DOMAIN;

  try {
    const encryptedBody = await request.body.data;

    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBody, decryptionKey);
    const body = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

    if (!body) {
      return response.status(403).json({ error: "Not a verified Data" });
    }

    const {
      id,
      token,
      firstName,
      lastName,
      middleName,
      companyName,
      mortageBrokerLicNo,
      mortgageBrokerageLicNo,
      city,
      state,
      postalCode,
      streetName,
      streetNumber,
      phoneNumber,
      apartmentNo,
      assistantFirstName,
      assistantLastName,
      assistantTwoFirstName,
      assistantTwoLastName,
      assistantPhoneNumber,
      assistantEmailAddress,
      assistantTwoEmailAddress,
      assistantTwoPhoneNumber,
      emailId,
      cellNumber,
      profileImage,
      smsNotification,
      emailNotification
    } = body;

    const formData = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      companyName: companyName,
      emailId: emailId,
      assistantTwoPhoneNumber: assistantTwoPhoneNumber,
      assistantTwoEmailAddress: assistantTwoEmailAddress,
      licenseNo: "",
      brokerageName: "",
      streetName: streetName,
      streetNumber: streetNumber,
      city: city,
      province: state,
      apartmentNo: apartmentNo,
      postalCode: postalCode,
      area: "",
      phoneNumber: phoneNumber,
      cellNumber: cellNumber,
      faxNumber: "",
      description: "",
      assistantEmailAddress: assistantEmailAddress,
      assistantFirstName: assistantFirstName,
      assistantLastName: assistantLastName,
      assistantPhoneNumber: assistantPhoneNumber,
      assistantTwoFirstName: assistantTwoFirstName,
      assistantTwoLastName: assistantTwoLastName,
      mortageBrokerageLicNo: mortgageBrokerageLicNo,
      mortageBrokerLicNo: mortageBrokerLicNo,
      profileImage: profileImage,
      getSms : smsNotification ? 1 : 0,
      getEmail : emailNotification ? 1 : 0
    };
    const userResponse = await axios.put(
      `${domain}/com.appraisalland.Broker/updateBrokerProfile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          BrokerId: id,
        },
      }
    );
    const user = userResponse.data;

    if (!user) {
      return response.status(404).json({ error: "User Not Found" });
    }
    return response
      .status(200)
      .json({ msg: "Successfully updated", userData: user });
  } catch (err) {
    // console.log(err);
    if (err.response) {
      // If the error is from an axios request (e.g., HTTP 4xx or 5xx error)
      const axiosError = err.response.data;
      const statusCode = err.response.status;
      console.error(statusCode, axiosError.message); // Log the error for debugging

      return response.status(statusCode).json({ error: axiosError.message });
    } else {
      // Handle other types of errors
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default handler;
