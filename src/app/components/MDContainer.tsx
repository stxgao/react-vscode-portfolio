import {
  Chip,
  Container,
  Divider,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialLight,
  materialDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { ReactElement } from "react-markdown/lib/react-markdown";
import { useTheme } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

interface Props {
  path: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function MarkdownLink(props: any) {
  return (
    <Link href={props.href} target="_blank" underline="hover">
      {props.children}
    </Link>
  );
}

function MarkdownTable(props: { children: ReactNode }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        {props.children}
      </Table>
    </TableContainer>
  );
}

function MarkdownTableCell(props: { children: ReactNode }) {
  return <StyledTableCell>{props.children}</StyledTableCell>;
}

function MarkdownTableRow(props: { children: ReactNode }) {
  return <StyledTableRow>{props.children}</StyledTableRow>;
}

function MarkdownCode(props: any): ReactElement {
  const theme = useTheme();
  let isDarkMode = theme.palette.mode === "dark";
  if (props.inline)
    return <Chip size="small" label={props.children?.toString()} />;
  else {
    const language = props.className.split("-")[1];
    return (
      <SyntaxHighlighter
        language={language}
        style={isDarkMode ? materialDark : materialLight}
        PreTag="div"
        showLineNumbers={true}
      >
        {props.children}
      </SyntaxHighlighter>
    );
  }
}

function MarkdownH1(props: { children: ReactNode }) {
  return (
    <>
      <Typography
        variant="h1"
        sx={{
          fontSize: "2em",
          display: "block",
          marginBlockStart: "0.67em",
          marginBlockEnd: "0.3em",
          fontWeight: "bold",
          lineHeight: 1.25,
        }}
      >
        {props.children}
      </Typography>
      <Divider />
    </>
  );
}

function MarkdownH2(props: { children: ReactNode }) {
  return (
    <>
      <Typography
        variant="h2"
        sx={{
          fontSize: "1.5em",
          display: "block",
          marginBlockStart: "0.83em",
          marginBlockEnd: "0.3em",
          fontWeight: "bold",
          lineHeight: 1.25,
        }}
      >
        {props.children}
      </Typography>
      <Divider />
    </>
  );
}

// function MarkdownCheckbox(props: any) {
//   let checked = props.checked;
//   if (checked) {
//     return (
//       <FormControlLabel
//         disabled
//         control={<Checkbox defaultChecked />}
//         label={props.label}
//       />
//     );
//   } else {
//     return (
//       <FormControlLabel disabled control={<Checkbox />} label={props.label} />
//     );
//   }
// }

// function MarkdownImage(props: any) {
//   return <img src={props.src} alt={props.alt} />;
// }

export default function MDContainer({ path }: Props) {
  const [content, setContent] = useState("");
  const { pathname } = useLocation();
  useEffect(() => {
    fetch(path)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [path]);

  useEffect(() => {
    let title = pathname.substring(1, pathname.length);
    title = title[0].toUpperCase() + title.substring(1);
    document.title = `${process.env.REACT_APP_NAME!} | ${title}`;
  }, [pathname]);

  return (
    <Container>
      <ReactMarkdown
        children={content}
        components={{
          code: MarkdownCode,
          a: MarkdownLink,
          // p: MarkdownParagraph,
          table: MarkdownTable,
          thead: TableHead,
          tbody: TableBody,
          th: MarkdownTableCell,
          tr: MarkdownTableRow,
          td: MarkdownTableCell,
          tfoot: TableFooter,
          h1: MarkdownH1,
          h2: MarkdownH2,
          // br: MarkdownBr,
          // input: MarkdownCheckbox,
          // img: MarkdownImage,
        }}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
      />
    </Container>
  );
}
