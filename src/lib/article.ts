import fs from "fs"
import matter from "gray-matter"
import path from "path"
import moment from "moment"
import {remark} from "remark"
import html from "remark-html"
import type {ArticleItem} from "@/types";


const articlesDirectory = path.join(process.cwd(), "/src/articles")

const getSortedArticles = (): ArticleItem[] => {
    const fileNames = fs.readdirSync(articlesDirectory)
    const allArticlesData = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/, "")
        const fullPath = path.join(articlesDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf-8")
        const matterResult = matter(fileContents)
        return {
            id,
            title: matterResult.data.title,
            date: matterResult.data.date,
            category: matterResult.data.category
        }
    })
    return allArticlesData.sort((a, b) => {
        const format = "DD-MM-YYYY"
        const dateOne = moment(a.date, format)
        const dateTwo = moment(b.date, format)
        if (dateOne.isBefore(dateTwo)) {
            return -1
        } else if (dateTwo.isAfter(dateOne)) {
            return 1
        } else {
            return 0
        }
    })
}
export const getCategorisedArticles = (): Record<string, ArticleItem[]> => {
    const sortedArticles = getSortedArticles()
    const categoriseArticles: Record<string, ArticleItem[]> = {}
    sortedArticles.forEach(article => {
        if (!categoriseArticles[article.category]) {
            categoriseArticles[article.category] = []
        }
        categoriseArticles[article.category].push(article)
    })
    console.log(categoriseArticles)
    return categoriseArticles
}
export const getArticleData = async (id: string) => {
    const fullPath = path.join(articlesDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf-8")
    const matterResult = matter(fileContents)
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()
    return {
        id,
        contentHtml,
        title: matterResult.data.title,
        category: matterResult.data.category,
        date: moment(matterResult.data.date, "DD-MM-YYYY").format("MMMM Do YYYY")

    }
}