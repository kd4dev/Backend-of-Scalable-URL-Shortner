import "dotenv/config";
import { shortenPostRequestSchema, updatePostRequestSchema } from "../validations/request.validation.js";
import { nanoid } from "nanoid";
import { createUrl, matchCode,getCodes, deleteCode, updateCode } from "../services/url.service.js";

export async function urlShortnerController(req, res) {
  const validationResult = await shortenPostRequestSchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);
  const kedar = await matchCode(shortCode);
  
  if(!kedar) {
    const result = await createUrl(shortCode, url, req.user.id);

    return res.json({
      id: result.id,
      shortCode: result.shortCode,
      targetUrl: result.targetUrl,
    });
  }
  if (kedar.shortCode === shortCode)
    return res.status(409).json({ error: `code already exist` });
}

export async function shortCodeTarget(req, res) {
  const code = req.params.shortcode;
  const result = await matchCode(code);

  if (!result) {
    console.log("nai mila kuch:", result);
    return res.status(404).json({ error: `Invalid URl 112` });
  }

  return res.redirect(result.targetUrl);
}

export async function getAllCodes(req,res){
  console.log("ye he id:",req.user.id)
  const codes=await getCodes(req.user.id)
  console.log(codes)
  return res.json({codes})
}

export async function deleteShortCode(req,res) {
  const userId=req.user.id;
  const urlShortCode=req.params.code;
  const check=await matchCode(urlShortCode);
  if(!check){
    return res.status(401).json({error:'Code to delete doesnt exist'})
  }
  const result=await deleteCode(userId,urlShortCode);
  if(!result){
     return res.status(403).json({error:`ypu are not authorised for this process`})
  }

  return res.status(201).json({deleted:true})
}

export async function updateShortCode(req,res){
  const validationResult=await updatePostRequestSchema.safeParseAsync(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }
  console.log("validationdata:",validationResult.data)
  const { oldCode,newCode }=validationResult.data;
  console.log("destru:",oldCode);
  console.log("destr:",newCode);
  const newCodeR = newCode ?? nanoid(6);
  console.log("check fiven or not newcode:",newCode)
  const check=await matchCode(oldCode);
  console.log("check:",check)
  if(!check){
    console.log("old code nai mila:");
    return res.status(409).json({error:'Shortcode you want to update doesent exist!'})
  }
  console.log("old code mila");
  const result=await updateCode(oldCode,newCodeR,req.user.id);
  if(!result){
    return res.status(403).json({error:`ypu are not authorised for this process`})
  }//agar dusra user ho toh,yunki and se kaam nai ho raha
  console.log(result)
  return res.status(201).json({updated:true})
}