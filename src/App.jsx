import { BrowserRouter, Routes, Route } from "react-router-dom";
import FilterCategories from "./components/filterCategories/FilterCategories"
import UserStories from "./components/userStories/UserStories";
import NavBar from "./components/navBar/NavBar";

function App() {
  return (
    <>
      <BrowserRouter>
      <NavBar/>
        <Routes>
        <Route path="/" element={<FilterCategories/>}></Route>
        <Route path="/yourStories" element={<UserStories/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
