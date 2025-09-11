import { TMText, TMTitle } from "@/app/components";
import { Card, Divider } from "antd";
import { RegisterForm } from ".";

export function RegisterFormWrapper() {
  return (
    <div className="tw:w-full tw:max-w-2xl tw:p-6">
      <Card>
        <div className="tw:p-2 tw:md:p-3">
          <TMTitle level={3}>Welcome to TM</TMTitle>
          <TMText type="secondary">Your Daily Task Manager</TMText>
          <div className="tw:py-2 tw:sm:py-3 tw:md:py-4 tw:lg:py-5">
            <Divider>Register with TM</Divider>
          </div>
          <RegisterForm />
        </div>
      </Card>
    </div>
  );
}
