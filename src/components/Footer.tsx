/* eslint-disable @next/next/no-img-element */
export default function Footer() {
  return (
    <p className="flex gap-2 justify-center items-center w-full p-6 font-sans text-sm text-zinc-300 md:w-2/3 md:p-4 lg:w-1/2 ">
      Made with {`<3`} by{" "}
      <a
        className="text-pink-200"
        href="https://discord.gg/nafi"
        target={"_blank"}
        rel="noreferrer"
      >
        Nafi
      </a>
      {" // "}
      <a
        className="text-pink-200"
        href="https://notgiving.com"
        target={"_blank"}
        rel="noreferrer"
      >
        Source
      </a>
      <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://vercel.com"
      >
        <img
          height="34px"
          src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg"
          alt="Powered by vercel"
        />
      </a>
    </p>
  );
}
