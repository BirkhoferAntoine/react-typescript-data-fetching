import {ReactNode, useEffect, useState} from "react";
import {get} from "./utils/http.ts";
import BlogPosts, {BlogPost} from "./components/BlogPosts.tsx";
import fetchingImg from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage.tsx";

type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
}

function App() {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>()
  const [error, setError] = useState<string>();
  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      try {
        const data = await get('https://jsonplaceholder.typicode.com/posts') as RawDataBlogPost[];

        const blogPosts = data.map(rawPost => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body
          }
        });
        setFetchedPosts(blogPosts);
      } catch (e) {
        //if (e instanceof Error) {}
        setError((e as Error).message);
      }
      setIsFetching(false);
    }
    fetchPosts();
  }, []);

  let content: ReactNode;

  if (fetchedPosts) content = <BlogPosts posts={fetchedPosts}/>
  if (isFetching) content = <p className={'loading-fallback'}>Content is loading...</p>
  if (error) content = <ErrorMessage text={error} />


  return (
      <main>
        <img src={fetchingImg} alt={'An abstract image depicting a data fetching'}/>
        {content}
      </main>
  );
}

export default App;
