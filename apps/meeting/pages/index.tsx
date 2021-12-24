import { Button } from "ui";
import { Test, t } from 'ts-types'
export default function Docs() {
  const d: Test = { name: "string" }
  return (
    <div>
      <h1>{d.name}</h1>
      <h1>{t ?? "t not defined"}</h1>
      <Button />
    </div>
  );
}
