import * as React from "react";

import { env } from "@/env";
import { applicationName } from "@/app-config";

export const BASE_URL = env.HOST_NAME;

export function VerifyEmail({ token }: { token: string }) {
  return `<body style="background-color: white; margin: auto; font-family: sans-serif;">
  <div style="border: solid 1px #eaeaea; border-radius: 8px; margin: 40px auto; padding: 20px; width: 465px;">
    <div style="margin-top: 32px;">
      <img
        src="${BASE_URL}/group.jpeg"
        width="160"
        height="48"
        alt="StarterKit"
        style="display: block; margin: 0 auto;"
      />
    </div>

    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
      <p style="color: black; font-weight: 500; font-size: 14px; line-height: 24px; margin-bottom: 8px;">
        Click the following link to verify your email
      </p>

      <p style="color: black; font-weight: 500; font-size: 14px; line-height: 24px;">
        <a
          href="${BASE_URL}/api/login/verify-email?token=${token}"
          target="_blank"
          rel="noopener noreferrer"
          style="color: #2754C5; text-decoration: underline;"
        >
          Verify Email
        </a>
      </p>
    </div>

    <hr style="border: solid 1px #eaeaea; margin: 26px 0; width: 100%;" />

    <p style="color: #666666; font-size: 12px; line-height: 24px; text-align: center; display: flex; align-items: center; justify-content: center;">
      © 2024 ${applicationName}. All rights reserved.
    </p>
  </div>
</body>`;
}

// const EmailHTML = ({ token, BASE_URL, applicationName }: any) => {
//   const containerStyle: React.CSSProperties = {
//     border: "solid 1px #eaeaea",
//     borderRadius: "8px",
//     margin: "40px auto",
//     padding: "20px",
//     width: "465px",
//   };

//   const imgStyle: React.CSSProperties = {
//     display: "block",
//     margin: "0 auto",
//   };

//   const textStyle: React.CSSProperties = {
//     color: "black",
//     fontWeight: "500",
//     fontSize: "14px",
//     lineHeight: "24px",
//   };

//   const linkStyle: React.CSSProperties = {
//     color: "#2754C5",
//     textDecoration: "underline",
//   };

//   const hrStyle: React.CSSProperties = {
//     border: "solid 1px #eaeaea",
//     margin: "26px 0",
//     width: "100%",
//   };

//   const footerStyle: React.CSSProperties = {
//     color: "#666666",
//     fontSize: "12px",
//     lineHeight: "24px",
//     textAlign: "center",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "white",
//         margin: "auto",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <div style={containerStyle}>
//         <div style={{ marginTop: "32px" }}>
//           <img
//             src={`${BASE_URL}/group.jpeg`}
//             width="160"
//             height="48"
//             alt="StarterKit"
//             style={imgStyle}
//           />
//         </div>

//         <div
//           style={{
//             textAlign: "center",
//             marginTop: "32px",
//             marginBottom: "32px",
//           }}
//         >
//           <p style={{ ...textStyle, marginBottom: "8px" }}>
//             Click the following link to verify your email
//           </p>

//           <p style={textStyle}>
//             <a
//               href={`${BASE_URL}/api/login/verify-email?token=${token}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={linkStyle}
//             >
//               Verify Email
//             </a>
//           </p>
//         </div>

//         <hr style={hrStyle} />

//         <p style={footerStyle}>
//           © 2024 {applicationName}. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// };
