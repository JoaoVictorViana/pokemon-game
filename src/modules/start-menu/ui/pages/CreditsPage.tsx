import { useNavigate } from 'react-router'

export default function CreditsPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full h-full flex flex-col gap-4 text-black">
      <header className="w-full h-[10%] bg-red-400 py-3 px-2 border rounded-xl text-white flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-3 cursor-pointer rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
        >
          {'<'}
        </button>
        Créditos
      </header>

      <p>
        Background artwork created by <strong>Harrison Walters</strong>.
        <br />
        Image found via Pinterest. All rights belong to the original artist.
      </p>
    </div>
  )
}
