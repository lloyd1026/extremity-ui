import Article from "../components/articles/article";
import Classification from "../components/classification/classification"

const ClassificationPage = ()=>{
    return (
        <div className="relative">
            <Classification />
            <Article />
        </div>
    )
}
export default ClassificationPage;