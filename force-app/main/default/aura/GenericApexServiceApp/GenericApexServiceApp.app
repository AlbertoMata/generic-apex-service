<aura:application extends="force:slds">

    <ltng:require scripts="{! $Resource.GenericApexService }" afterScriptsLoaded="{!c.scripts_cargados}" />

    <c:apexService aura:id="apex_service" />

    <lightning:button label="get_accounts" onclick="{!c.query_accounts}" />
    <lightning:button label="find_accounts" onclick="{!c.search_accounts}" />
    <lightning:button label="insert_accounts" onclick="{!c.insert_accounts}" />
    <lightning:button label="delete_accounts" onclick="{!c.delete_accounts}" />
    
    <c:apexServiceDemo /> 


</aura:application>	
