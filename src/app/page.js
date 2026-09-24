// src/app/page.js
// The app's entry point. For now it simply forwards visitors to the login page.
// Later, once auth + products exist, the root can decide: logged in -> /products,
// logged out -> /login. redirect() is the App Router way to do a server redirect.

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
