export default function Home() {
  // const test = await api.post.hello.query({ text: "world" }); still not working, waiting for rsc implementation of trpc

  const test = { greeting: "Hello world (from server)" };
  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center text-center font-mono text-2xl">
        {test.greeting}
      </div>
      {/* <div className="flex h-screen w-screen flex-1 items-center justify-center text-center font-sans text-3xl font-bold">
        <p>{test.greeting}</p>
      </div> */}
    </>
  );
}
