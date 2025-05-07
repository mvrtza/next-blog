 import type {ArticleItem} from "@/types";
 import Link from "next/link";
interface Props{
    category:string
    articles: ArticleItem[]
}
const ArticleItemList = ({category,articles}:Props)=>{
return(
    <div className="flex flex-col gap-5 ">
        <h2 className="font-coromorantGaramond text-4xl">{category}</h2>
        <div className="flex flex-col gap-2.5 font-poppins text-lg">{
         articles.map((article,id)=>(
             <Link href={`/${article.id}`} key={id} className="text-neutral-900 hover:text-amber-700 transition duraction-150">
                 {article.title}
             </Link>
         ))
        }
        </div>
    </div>
)
}
export default ArticleItemList