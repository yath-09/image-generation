import Link from "next/link";
import { Button } from "flowbite-react";

const Company=[
    {Title:"About",href:"/"},
    {Title:"Pricing",href:"/"},
    {Title:"Blog",href:"/"},
    {Title:"Careers",href:"/"}
]
const Help=[
    {Title:"FAQ",href:"/"},
    {Title:"Contact",href:"/"},
    {Title:"Privacy",href:"/"},
    {Title:"Terms",href:"/"}
]


export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold font-mono text-xl bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">Photo AI</span>
            </div>

            <p className="mt-4 max-w-sm text-muted-foreground">
            Photo AI helps you create stunning, AI-enhanced portraits effortlessly. Turn any photo into a masterpiece with our advanced AI technology.
            </p>

            <div className="mt-6 flex gap-4">
              <Button color="gray" pill>
                <Link
                  href="https://x.com/YatharthAhuja9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button color="gray" pill>
                <Link
                  href="https://github.com/yath-09/image-generation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="space-y-4">
              <p className="font-medium">Company</p>
              <nav className="flex flex-col space-y-2">
                {Company.map((item,index)=>(
                    <Link href={`${item.href}`} key={index} ><span className="hover:underline">{item.Title}</span></Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <p className="font-medium">Help</p>
              <nav className="flex flex-col space-y-2">
                {Help.map((item,index)=>(
                    <Link href={`${item.href}`} key={index} className="hover:underline">{item.Title}</Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} PhotoAi. All rights reserved.
            </p>

            <div className="flex gap-4">
              <Button color="gray" pill>
                <Link href="/">Privacy Policy</Link>
              </Button>
              <Button color="gray" pill>
                <Link href="/">Terms of Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
