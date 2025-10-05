// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  // <BrowserRouter>
  //   <Routes>
  //     {/* <Route path=HOME_ROUTE element={<App />} /> */}
  //     <Route path="/" element={<App />} />
  //     <Route path="/index.html" element={<App />} />
  //     <Route path="/login" element={<Login />} />
  //     <Route path="/signup" element={<Signup />} />
  //     <Route path="/home" element={<Home />} />
  //     <Route path="/pets/create" element={<NewPet />} />
  //     <Route path="/pets/:petId" element={<PetDetail />} />
  //     <Route path="/matching" element={<Matching />} />
  //     <Route path="/figma_matching" element={<FigmaMatchingApp />} />
  //     <Route path="/chat/:chatThreadId" element={<ChatView />} />
  //   </Routes>
  // </BrowserRouter>,
  <StrictMode>
    <App />
  </StrictMode>
);
