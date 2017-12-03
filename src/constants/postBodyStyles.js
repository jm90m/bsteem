const bodyStyles = `
<style>
.Body {
  font-family: 'Source Sans Pro', sans-serif;
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.6em;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  -webkit-hyphens: none;
      -ms-hyphens: none;
          hyphens: none;
  margin: 4px 0;
}
.Body h1,
.Body h2,
.Body h3,
.Body h4,
.Body h5,
.Body h6 {
  font-weight: 700;
}
.Body h1 {
  margin: 2.5rem 0 0.3rem;
  font-size: 160%;
}
.Body h2 {
  margin: 2.5rem 0 0.3rem;
  font-size: 140%;
}
.Body h3 {
  margin: 2rem 0 0.3rem;
  font-size: 120%;
}
.Body h4 {
  margin: 1.5rem 0 0.2rem;
  font-size: 110%;
}
.Body h5 {
  margin: 1rem 0 0.2rem;
  font-size: 100%;
}
.Body h6 {
  margin: 1rem 0 0.2rem;
  font-size: 90%;
}
.Body p {
  font-size: 100%;
  line-height: 150%;
}
.Body p:not(:last-child) {
  margin: 0 0 0.5rem 0;
}
.Body ol {
  list-style-type: decimal;
}
.Body ul {
  list-style-type: disc;
}
.Body ol,
.Body ul {
  margin-left: 20px;
}
.Body ol li,
.Body ul li {
  list-style-position: outside;
  margin: 8px 0;
}
.Body blockquote {
  padding-left: 1rem;
  margin: 0.4rem 0;
  border-left: 1px solid rgba(0, 0, 0, 0.6);
  color: rgba(0, 0, 0, 0.6);
}
.Body :not(pre) > code {
  padding: 2px 4px;
  color: #c7254e;
  background-color: #f9f2f4;
}
.Body pre {
  overflow: auto;
  padding: 10px 20px;
  margin-bottom: 14px;
  line-height: 1em;
  background-color: #f7f7f9;
}
.Body pre code {
  font-size: 16px;
}
.Body table {
  width: 100%;
  display: block;
  overflow: auto;
}
.Body table tr > th {
  text-align: left;
  background-color: #f2f2f2;
}
.Body table tr > th,
.Body table td {
  padding: 4px 12px;
  word-wrap: break-word;
  vertical-align: middle;
  word-break: normal;
}
.Body table tr:nth-child(even) td {
  background-color: #f2f2f2;
}
.Body div.pull-left {
  float: left;
  padding-right: 1rem;
  max-width: 50%;
}
.Body div.pull-right {
  float: right;
  padding-left: 1rem;
  max-width: 50%;
}
.Body div.text-justify {
  text-align: justify;
}
.Body div.text-right {
  text-align: right;
}
.Body div.text-center {
  text-align: center;
}
.Body div.text-rtl {
  direction: rtl;
}
.Body img {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: none;
  display: inline-block;
  vertical-align: middle;
  margin-top: 20px;
}
.Body hr {
  clear: both;
  margin: 20px auto;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #e9e7e7;
}
.Body:after {
  content: "";
  display: table;
  clear: both;
}
.Body--full {
  margin: 0;
  font-size: 18px;
}
@media only screen and (min-width: 768px) {
  .Body--full {
    font-size: 21px;
  }
}
.Body--full p:not(:last-child) {
  margin: 0 0 1.5rem 0;
}
</style>
`;

export default bodyStyles;
