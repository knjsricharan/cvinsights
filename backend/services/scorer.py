def apply_weighted_score(llm_analysis: dict) -> dict:
    # Check if necessary keys exist
    if not isinstance(llm_analysis, dict):
        return llm_analysis
        
    weights = {
        "experience": 0.30,
        "skills": 0.20,
        "keyword_density": 0.20,
        "quantification": 0.15,
        "formatting": 0.15
    }
    
    # Extract sub-scores
    section_scores = llm_analysis.get("section_scores", {})
    exp_score = section_scores.get("experience") or 50 # Default to 50 if missing
    skills_score = section_scores.get("skills") or 50
    kd_score = llm_analysis.get("keyword_density_score", 50)
    quant_score = llm_analysis.get("quantification_score", 50)
    fmt_score = llm_analysis.get("formatting_score", 50)
    
    # Calculate final score
    final_score = (
        (exp_score * weights["experience"]) +
        (skills_score * weights["skills"]) +
        (kd_score * weights["keyword_density"]) +
        (quant_score * weights["quantification"]) +
        (fmt_score * weights["formatting"])
    )
    
    final_score = int(round(final_score))
    
    # Assign grade based on final score
    if final_score >= 90: grade = "A"
    elif final_score >= 80: grade = "B"
    elif final_score >= 70: grade = "C"
    elif final_score >= 60: grade = "D"
    else: grade = "F"
    
    llm_analysis["overall_score"] = final_score
    llm_analysis["grade"] = grade
    
    # Add breakdown
    llm_analysis["score_breakdown"] = {
        "experience": {"score": exp_score, "weight": weights["experience"]},
        "skills": {"score": skills_score, "weight": weights["skills"]},
        "keyword_density": {"score": kd_score, "weight": weights["keyword_density"]},
        "quantification": {"score": quant_score, "weight": weights["quantification"]},
        "formatting": {"score": fmt_score, "weight": weights["formatting"]}
    }
    
    llm_analysis["improvement_potential"] = max(0, 100 - final_score)
    
    return llm_analysis
