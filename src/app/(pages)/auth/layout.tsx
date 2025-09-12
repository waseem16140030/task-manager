import Image from 'next/image'
import Link from 'next/link'
import loginImage from '@root/public/login-bg.svg'
import logoImage from '@root/public/logo.png'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="tw:grid tw:grid-rows-[auto_1fr] tw:lg:grid-cols-2 tw:min-h-screen">
      <div className="tw:grid tw:lg:grid-rows-[auto_1fr] tw:min-h-fit tw:lg:min-h-screen animate-gradient tw:bg-gradient-to-br tw:from-green-50 tw:via-indigo-50 tw:to-blue-50">
        <div className="tw:flex tw:items-center tw:gap-x-2 tw:p-6">
          <Link href="/auth/signin">
            <Image
              className="tw:dark:invert"
              src={logoImage}
              alt="ask Manager Icon"
              width={125}
              height={26}
            />
          </Link>
        </div>
        <div className="tw:self-center tw:justify-items-center tw:hidden tw:lg:block">
          <Image
            className="tw:dark:invert"
            src={loginImage}
            height={500}
            width={500}
            alt="Login image"
            loading="lazy"
            priority={false}
          />
        </div>
      </div>
      <div className="tw:self-center tw:justify-items-center">{children}</div>
    </div>
  )
}
