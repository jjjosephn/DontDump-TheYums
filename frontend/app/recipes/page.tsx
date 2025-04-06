"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react"; // Icon for the filter button
import RecipePage from "@/components/RecipePage"

// need to import mutator from api.ts

export default function recipes() {

  // Functionality:
  // temp possibly move elsewhere:
  // onChange?? needed to gather the search input too many calls
  // onSubmit call the api
  
  // onSubmit
  // get gather all the filters
  // gather the search terms
  // separate between search complex search and search by ingredients
  // tabs: by name, using expiring ingredients, bookmarked
  // by name allows search bar
  // using expiring ingredients does not have search bar
  // has a select ingredients button and a submit button
  // clicking on the select ingredients button opens up a modal
  // modal has all ingrededients hardcoded to show expiring soonesdt
  // selecting each "badge" produces a highlight
  // if ingredient just got highlighted, append to list
  // /remove from list if unhighlighted
  // on submit convert list to be ',+' in
  // pass to api (url) -> router (url, function) -> controller (function, req, res) 

  // Components: (complex need to make custom components) simple = built-in
  // search box w/ (simple) submit button
  // filter for searcn (complex component)
  // results area (complex component)
  // 

  // GET https://api.spoonacular.com/recipes/complexSearch?
  // query=pasta&maxFat=25&number=2
  // 

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2x1 font-bold mb-4">Recipes</h1>
      <RecipePage></RecipePage>
    </main>
  );
}
