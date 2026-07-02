import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function GoogleSignInButton() {

  const navigate = useNavigate();

  async function handleGoogleSuccess(credentialResponse) {

    try {

      const response = await api.post(
        "/google-login",
        {
          token: credentialResponse.credential
        }
      );

      const data = response.data;

      if (data.success) {

        localStorage.setItem(
          "token",
          data.access_token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/devotee/dashboard");

      } else {

        alert(data.message);

      }

    }

    catch (err) {

      console.error(err);

      alert(
        "Google Login Failed"
      );

    }

  }

  return (

    <div className="w-full flex justify-center">

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {

          alert(
            "Google Sign In Failed"
          );

        }}
      />

    </div>

  );

}