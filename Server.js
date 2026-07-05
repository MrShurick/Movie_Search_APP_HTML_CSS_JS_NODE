const http = require("http");

http
.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    const API_KEY = "9aa61cc7";

    if (request.method === "OPTIONS") {
        response.end();
        return;
    }
    if (request.method === "POST") {
        let body = [];
        
        request
        .on("error", (err) => {
            console.log(err);
        })
        .on("data", (chunk) => {
            body.push(chunk);
        })
        .on("end", () => {
            body = Buffer.concat(body).toString();
            try {
                const data = JSON.parse(body);
                const { title, type, page, id } = data;
                const curPage = page || 1;
                
                let apiUrl;
                
                if (id) {
                    apiUrl = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`;
                    
                    http.get(apiUrl, (apiResponse) => {
                        let res = "";
                        apiResponse
                        .on("data", (chunk) => {
                            res += chunk;
                        })
                        .on("end", () => {
                            response.end(res);
                        });
                    });
                    return;
                }

                if (!title || title.length < 2) {
                    response.end(
                        JSON.stringify({
                            error: "Название слишком короткое",
                        }),
                    );
                    return;
                }

                apiUrl = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}&type=${encodeURIComponent(type)}&page=${curPage}`;

                http.get(apiUrl, (apiResponse) => {
                    let res = "";
                    apiResponse
                    .on("data", (chunk) => {
                        res += chunk;
                    })
                    .on("end", () => {
                        response.end(res);
                    });
                });
            } catch (e) {
                console.log(e);
            }
        });
    }
})
.listen(3000);
