import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreateScriptModalProps {
  givenAiPrompt: string
  setGivenAiPrompt: (s: string) => void
  generatedScript: string
  setGeneratedScript: (s: string) => void
  loadingScript: boolean
  handleGenerate: () => Promise<void>
}

export function CreateScriptModal(
  {
  givenAiPrompt,
  setGivenAiPrompt,
  generatedScript,
  setGeneratedScript,
  loadingScript,
  handleGenerate,
}: CreateScriptModalProps
) {
  
  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Script Generator</DialogTitle>
            <DialogDescription>
              Give a Prompt, Generated Script, and use it in your TTS(Text To Speech).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Prompt</Label>
              <Input id="name-1" name="name" value={givenAiPrompt} onChange={(e) => {
                // console.log("Prompt changed", e.target.value);
                setGivenAiPrompt(e.target.value);
              }}/>
              <Button type="button" onClick={handleGenerate} >
                {loadingScript ? "Generating..." : "Generate"}
              </Button>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="scriptarea">Generated Script</Label>
              <Textarea
                id="scriptarea"
                name="scriptarea"
                value={generatedScript}
                rows={3}
                onChange={(e) => setGeneratedScript(e.target.value)}
                placeholder="Generated script will appear here..."
              />
            </div>
          </div>
          {/* {loading && (
            <div className="text-sm text-gray-500">
              Generating script, please wait...
            </div>
          )}
           */}
          <DialogFooter>
  
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            
            {/* prompt na thakle error deya */}
            <Button type="submit" onClick={() => console.log("Use clicked")}>Use</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
