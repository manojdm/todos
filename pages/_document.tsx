import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/icon-192x192.png"></link>
				<meta name="theme-color" content="#fff" />
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
					integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
					crossOrigin="anonymous"
					referrerPolicy="no-referrer"
				/>
			</Head>
			<body>
				<div className="container">
					<Main />
					<NextScript />
				</div>
			</body>
		</Html>
	);
}
