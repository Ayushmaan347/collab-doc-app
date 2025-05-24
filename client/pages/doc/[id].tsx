import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import dynamic from "next/dynamic";
import axios from "axios";

// Quill must be loaded dynamically to avoid SSR issues
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Connect socket
const socket = io("http://localhost:5000");

const DocumentEditor = () => {
  const router = useRouter();
  const { id } = router.query;

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!id) return;

    // Load initial document
    axios.get(`http://localhost:5000/api/docs/${id}`).then((res) => {
      setContent(res.data.content);
      setTitle(res.data.title);
    });

    // Join socket room
    socket.emit("join-doc", id);

    // Listen for incoming changes
    socket.on("doc-update", (newContent: string) => {
      setContent(newContent);
    });

    return () => {
      socket.emit("leave-doc", id);
      socket.off("doc-update");
    };
  }, [id]);

  useEffect(() => {
  const timeout = setTimeout(() => {
    axios.put(`http://localhost:5000/api/docs/${id}`, {
      title,
      content,
    }).catch(console.error);
  }, 1000); // save 1 sec after last change

  return () => clearTimeout(timeout);
}, [content, title]);

  const handleChange = (val: string) => {
    setContent(val);
    socket.emit("send-changes", { docId: id, content: val });
  };

  return (
    <div className="p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl font-bold w-full border-b mb-4 outline-none"
      />
      <QuillEditor value={content} onChange={handleChange} theme="snow" />
    </div>
  );
};

// ✅ This is critical!
export default DocumentEditor;
