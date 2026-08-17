import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  StrikeThroughSupSubToggles,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export default function RichMarkdownEditor({value, onChange}:{value:string; onChange:(value:string)=>void}) {
  return <MDXEditor
    markdown={value}
    onChange={onChange}
    className="mdx-editor-shell"
    contentEditableClassName="mdx-editor-content"
    spellCheck
    plugins={[
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      imagePlugin({disableImageResize:false, allowSetImageDimensions:true}),
      tablePlugin(),
      codeBlockPlugin({defaultCodeBlockLanguage:"text"}),
      codeMirrorPlugin({codeBlockLanguages:{text:"Text", js:"JavaScript", ts:"TypeScript", tsx:"TSX", python:"Python", bash:"Shell", json:"JSON", yaml:"YAML", sql:"SQL"}}),
      diffSourcePlugin({viewMode:"rich-text", diffMarkdown:value}),
      markdownShortcutPlugin(),
      toolbarPlugin({toolbarContents:() => <DiffSourceToggleWrapper>
        <UndoRedo/>
        <Separator/>
        <BlockTypeSelect/>
        <BoldItalicUnderlineToggles/>
        <StrikeThroughSupSubToggles options={["Strikethrough"]}/>
        <Separator/>
        <ListsToggle options={["bullet", "number"]}/>
        <CreateLink/>
        <InsertImage/>
        <InsertTable/>
        <InsertCodeBlock/>
        <InsertThematicBreak/>
      </DiffSourceToggleWrapper>}),
    ]}
  />;
}
