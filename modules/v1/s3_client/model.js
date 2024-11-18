const { Sequelize, Op } = require("sequelize");
const { t } = require("localizify");
const common = require("../../../config/common");
const moment = require("moment");
const _ = require('lodash');
const global = require("../../../config/constants");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require('fs');
const path = require('path');
// const puppeteer = require('puppeteer');
// const PDFDocument = require('pdfkit');
const { chromium, firefox, webkit } = require('playwright');



const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    },
});


exports.imageUpload = async (req) => {
    try {
        const uploadUrls = [];

        // Loop through each file request
        for (const fileReq of req.image_folders) {
            const file = new Date().getTime();
            const fileName = `${fileReq.bucket_folder_name}/${file}${moment().format("X")}.${fileReq.file_type}`;

            const s3Params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                ContentType: `image/${fileReq.file_type}`,
                ACL: "public-read",
            };

            // Generate the pre-signed URL for each file
            const signedUrl = await getSignedUrl(s3Client, new PutObjectCommand(s3Params));

            // Push the folder name and URL to the response array
            uploadUrls.push({
                folder_name: fileReq.bucket_folder_name,
                url: signedUrl,
            });
        }

        console.log(uploadUrls, "Generated image URLs for multiple folders");

        // Return the response with folder names and pre-signed URLs
        return {
            code: global.SUCCESS,
            message: { keyword: 'rest_keywords_image_file_upload_success', content: {} },
            data: uploadUrls,
        };
    } catch (error) {
        console.error("Error generating image URLs:", error);
        throw error;
    }
};

exports.generatePDFAndUpload = async (htmlTemplate, fileName, browserType = 'chromium') => {
    try {
        // Choose the browser type: chromium, firefox, or webkit
        const browser = await { chromium, firefox, webkit }[browserType].launch();
        const page = await browser.newPage();

        // Set the HTML content
        await page.setContent(htmlTemplate);

        // Generate PDF in memory
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        // Define the S3 upload parameters
        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `user_test_certificate/${Date.now()}_${fileName}`, // Adding timestamp to avoid name collisions
            ContentType: 'application/pdf',
            ACL: 'public-read',
            Body: pdfBuffer,
        };

        // Upload the PDF to S3
        await s3Client.send(new PutObjectCommand(s3Params));

        console.log('PDF uploaded successfully:', s3Params.Key);

        const uploadedFileName = path.basename(s3Params.Key);

        return uploadedFileName;
    } catch (error) {
        throw error;
    }
};



// // single url generate 
// exports.imageUploadsingle = async (req) => {
//     try {
//         console.log("s3 client");

//         const file = new Date().getTime();
//         const fileName = `${req.bucket_folder_name}/${file}${moment().format("X")}.${req.file_type}`;

//         const s3Params = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: fileName,
//             ContentType: `image/${req.file_type}`,
//             ACL: "public-read",
//             // Body: fileContent
//         };

//         // Generate pre-signed URL for uploading the image
//         const signedUrl = await getSignedUrl(s3Client, new PutObjectCommand(s3Params));

//         console.log(signedUrl, "image url s3 bucket");

//         return signedUrl
//         // // Send the response with the pre-signed URL of the upload.
// return {
//     code: global.SUCCESS,
//     message: { keyword: 'rest_keywords_image_file_upload_success', content: {} },
//     data: signedUrl,
// };
//         // return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_image_uploaded, signedUrl);
//     } catch (error) {
//         throw error;
//         // return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_image_not_uploaded, null);
//     }
// }

// // multiple url generate 
// exports.imageUpload = async(req)=>{
//     try {

//     } catch (error) {

//     }
// }


// // pdf convert bt pdf kit
// exports.generatePDFAndUpload = async (htmlContent, fileName) => {
//     try {
//         // Create a new PDF document
//         const doc = new PDFDocument();

//         // Create a buffer to store the generated PDF
//         const pdfBuffer = await new Promise((resolve, reject) => {
//             const buffers = [];
//             doc.on('data', buffers.push.bind(buffers));
//             doc.on('end', () => {
//                 resolve(Buffer.concat(buffers));
//             });

//             // Add content to the PDF
//             doc.text(htmlContent);

//             // Finalize the PDF
//             doc.end();
//         });

//         // Define the S3 upload parameters
//         const s3Params = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: `user_test_certificate/${Date.now()}_${fileName}`, // Adding timestamp to avoid name collisions
//             ContentType: 'application/pdf',
//             ACL: 'public-read',
//             Body: pdfBuffer,
//         };

//         // Upload the PDF to S3
//         await s3Client.send(new PutObjectCommand(s3Params));

//         console.log('PDF uploaded successfully:', s3Params.Key);

//         const uploadedFileName = path.basename(s3Params.Key);

//         return uploadedFileName;
//     } catch (error) {
//         throw error;
//     }
// };

// //puppeteer generation pdf
// exports.generatePDFAndUpload = async (htmlContent, fileName) => {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         await page.setContent(htmlContent);

//         // Generate PDF in memory
//         const pdfBuffer = await page.pdf({
//             format: 'A4',
//             printBackground: true,
//         });

//         await browser.close();

//         // Define the S3 upload parameters
//         const s3Params = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: `user_test_certificate/${Date.now()}_${fileName}`, // Adding timestamp to avoid name collisions
//             ContentType: 'application/pdf',
//             ACL: 'public-read',
//             Body: pdfBuffer,
//         };

//         // Upload the PDF to S3
//         await s3Client.send(new PutObjectCommand(s3Params));

//         console.log('PDF uploaded successfully:', s3Params.Key);

//         const uploadedFileName = path.basename(s3Params.Key);

//         return uploadedFileName;
//     } catch (error) {
//         throw error;
//     }
// }

// try {
//     // Read the image file from your local file system
//     const fileContent = fs.readFileSync('/home/hlink/Pictures/ProjectPic/bird-8132549_960_720.jpg');

//     // Define the file name and path within the S3 bucket
//     const fileName = `user_image/bird-8132549_960_720.jpg`;

//     // Set the parameters for the S3 upload
//     const s3Params = {
//         Bucket: process.env.S3_BUCKET_NAME,
//         Key: fileName,
//         ContentType: `image/png`,
//         ACL: "public-read",
//         Body: fileContent,
//     };

//     // Upload the image to S3
//     await s3Client.send(new PutObjectCommand(s3Params));

//     const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
//     console.log('Image uploaded successfully:', imageUrl);

//     // return middleware.sendResponse(res, Codes.SUCCESS, lang[req.language].rest_keywords_image_uploaded, { imageUrl });
// } catch (error) {
//     console.error('Error uploading image:', error);
//     // return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_image_not_uploaded, null);
// }



    // //generate pdf
    // generatePDF: async (htmlContent, filePath) => {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    
    //     await page.setContent(htmlContent);
    
    //     await page.pdf({
    //         path: filePath, // Output file path
    //         format: 'A4',
    //         printBackground: true,
    //     });
    
    //     await browser.close();
    
    //     // Return file path or a success message
    //     return filePath;
    // },

    // generatePdfFromHtml: async (data) => {
    //     const templateHtml = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
    //     const template = handlebars.compile(templateHtml);
    //     const html = template(data);

    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    //     await page.setContent(html, { waitUntil: 'networkidle0' });

    //     const pdfBuffer = await page.pdf({ format: 'A4' });
    //     await browser.close();

    //     return pdfBuffer;
    // }


