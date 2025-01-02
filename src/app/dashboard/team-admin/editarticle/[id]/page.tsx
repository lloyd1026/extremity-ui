'use client'
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Content from "@/components/articlecontentEditor/contentback";

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams(); // Access params as a Promise
  const articleId = params.id as string; // Access id directly from params

  useEffect(() => {
    if (isNaN(Number(articleId))) {
      router.push("/404");
    }
  }, [articleId, router]);

  return (
    <div>
        <Content id={articleId}></Content>
    </div>
  );
}