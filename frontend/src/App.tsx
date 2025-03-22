import { Button } from "./components/ui/button"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"

function App() {
  return (
    <>
      <h1 className="text-red-300 text-5xl">Hello</h1>
      <Button variant={"outline"}>button me</Button>

      <header>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>

    </>
  )
}

export default App