// src/styles/loginStyles.ts

const containerStyle = {
  position: "relative" as const,
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
  padding: "1rem",
  overflow: "hidden",
};

const canvasStyle = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
};

const formStyle = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "2.5rem",
  borderRadius: "16px",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
  maxWidth: "450px",
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
  gap: "1.5rem",
  zIndex: 1,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const titleStyle = {
  color: "#1e40af",
  fontSize: "2.5rem",
  fontWeight: "700",
  textAlign: "center" as const,
  margin: "0",
  letterSpacing: "-0.025em",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "0.75rem",
};

const labelStyle = {
  color: "#1e40af",
  fontSize: "1rem",
  fontWeight: "600",
};

const inputStyle = {
  padding: "0.875rem 1rem",
  borderRadius: "10px",
  border: "1px solid #bfdbfe",
  fontSize: "1rem",
  outline: "none",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  backgroundColor: "#f8fafc",
};

const buttonStyle = {
  padding: "0.875rem",
  borderRadius: "9999px",
  border: "none",
  background: "linear-gradient(90deg, #1e40af, #3b82f6)",
  color: "#ffffff",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease, transform 0.2s ease",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
};

const messageStyle = {
  textAlign: "center" as const,
  fontSize: "0.875rem",
  fontWeight: "500",
  color: (type: string) =>
    type.includes("thành công") ? "#059669" : "#dc2626",
};

export {
  containerStyle,
  canvasStyle,
  formStyle,
  titleStyle,
  inputGroupStyle,
  labelStyle,
  inputStyle,
  buttonStyle,
  messageStyle,
};


