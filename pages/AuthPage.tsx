import RegisterForm from "../auth/RegisterForm";
import LoginForm from "../auth/LoginForm";

export default function AuthPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center h-screen bg-gray-100">
      <RegisterForm />
      <LoginForm />
    </div>
  );
}
