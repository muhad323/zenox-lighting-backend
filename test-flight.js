const http = require('http');

const PORT = process.env.PORT || 5005;
const BASE_URL = `http://localhost:${PORT}`;

const endpoints = [
    '/',
    '/api/products',
    '/api/product_categories',
    '/api/blog_posts',
    '/api/projects',
    '/api/services',
    '/api/testimonials',
    '/api/contact_messages',
    '/api/career_postings',
    '/api/career_applications',
    '/api/hero_content',
    '/api/newsletter_subscribers',
    '/api/product_inquiries',
    '/api/company_settings',
    '/api/profiles',
    '/api/user_roles'
];

console.log(`\n✈️  STARTING BACKEND TEST FLIGHT on port ${PORT}...`);
console.log(`==================================================\n`);

function testEndpoint(endpoint) {
    return new Promise((resolve) => {
        const url = `${BASE_URL}${endpoint}`;
        const start = Date.now();

        http.get(url, (res) => {
            const { statusCode } = res;
            let data = '';

            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const duration = Date.now() - start;
                let statusIcon = statusCode >= 200 && statusCode < 300 ? '✅' : '❌';
                let itemCount = 'N/A';

                try {
                    if (statusCode === 200 && endpoint !== '/') {
                        const json = JSON.parse(data);
                        if (Array.isArray(json)) {
                            itemCount = `${json.length} items`;
                        } else {
                            itemCount = 'Object';
                        }
                    }
                } catch (e) {
                    itemCount = '(Non-JSON response)';
                }

                console.log(`${statusIcon}  ${statusCode}  ${endpoint.padEnd(30)} ${duration}ms \t ${itemCount}`);
                resolve({ endpoint, statusCode, success: statusCode >= 200 && statusCode < 300 });
            });
        }).on('error', (err) => {
            console.log(`❌  ERR  ${endpoint.padEnd(30)} -- ms \t Connection Refused/Error`);
            resolve({ endpoint, statusCode: 0, success: false });
        });
    });
}

(async () => {
    // Wait for server to potentially wake up if needed, though we assume it's running
    const results = [];

    for (const endpoint of endpoints) {
        const result = await testEndpoint(endpoint);
        results.push(result);
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    console.log(`\n==================================================`);
    console.log(`🏁  FLIGHT COMPLETE`);
    console.log(`📊  Summary: ${successCount}/${totalCount} endpoints operational.`);

    if (successCount === totalCount) {
        console.log(`🎉  ALL SYSTEMS GO!`);
    } else {
        console.log(`⚠️   SOME SYSTEMS REPORTING ERRORS. CHECK LOGS ABOVE.`);
    }
    console.log(`==================================================\n`);
})();
