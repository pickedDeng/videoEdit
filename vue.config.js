module.exports = {
    publicPath:"./",
    outputDir:"dist",
    assetsDir: 'assets',
    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        hotOnly: true,
        proxy: null,
    }
}