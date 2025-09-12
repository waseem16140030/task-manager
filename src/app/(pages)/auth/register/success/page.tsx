import { TMText, TMTitle } from '@/app/components'
import successImg from '@root/public/success.png'
import { Button, Card } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
export default function SuccessPage() {
  return (
    <div className="tw:w-full tw:max-w-xl tw:p-6">
      <Card>
        <div className="tw:p-2 tw:md:p-6">
          <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-6">
            <Image width={100} height={100} src={successImg} alt="Register Successfully" />
            <TMTitle level={4} className="tw:!leading-5 tw:text-center">
              Registered Successfully
            </TMTitle>
            <TMText size="sm" type="secondary" className="tw:font-medium tw:text-center">
              Your password has registered successfully. You can now log in with your credentials.
            </TMText>
            <Link href="/auth/signin">
              <Button block type="primary">
                Back To Login
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
