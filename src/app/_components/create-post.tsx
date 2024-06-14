"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost.mutate({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={handleChange}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
